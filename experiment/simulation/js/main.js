import * as gatejs from "./gate.js";
import { wireColours } from "./layout.js";
import "./layout.js"; // Import layout.js to execute changeTabs setup
import * as clockjs from "./clock.js";
import * as flipflopjs from "./flipflop.js";
import { deleteFF } from "./flipflop.js";
import { deleteElement } from "./gate.js";

("use strict");

let num_wires = 0;

document.getScroll = function () {
  if (window.scrollY != undefined) {
    return [scrollX, scrollY];
  } else {
    let sx,
      sy,
      d = document,
      r = d.documentElement,
      b = d.body;
    sx = r.scrollLeft || b.scrollLeft || 0;
    sy = r.scrollTop || b.scrollTop || 0;
    return [sx, sy];
  }
};
const workingArea = document.getElementById("working-area");
export const jsPlumbInstance = jsPlumbBrowserUI.newInstance({
  container: workingArea,
  maxConnections: -1,
  endpoint: {
    type: "Dot",
    options: { radius: 6 },
  },
  dragOptions: {
    containment: "parentEnclosed",
    containmentPadding: 5,
  },
  connector: "Flowchart",
  paintStyle: { strokeWidth: 4, stroke: "#888888" },
  connectionsDetachable: false,
});

// Returns the component (gate, input/output bit, clock or flip-flop) with the given id
function findComponent(id) {
  return gatejs.gates[id] || flipflopjs.flipFlops[id] || null;
}

function isFlipFlop(component) {
  return (
    component &&
    (component.constructor.name === "JKFlipFlop" ||
      component.constructor.name === "DFlipFlop")
  );
}

// Returns the id of the label overlay of an endpoint (the pin name); it is empty for gates and input/output bits
function pinLabel(endpoint) {
  const keys = Object.keys(endpoint.overlays || {});
  return keys.length > 0 ? keys[0] : "";
}

// Tells which output of a component a wire starts from: "Q" or "Q'" for a flip-flop, "" for everything else
function outputPos(component, endpoint) {
  if (isFlipFlop(component)) {
    return pinLabel(endpoint).includes("qbarout") ? "Q'" : "Q";
  }
  return "";
}

// Returns the output endpoint and the input endpoint of a wire, whichever way it was drawn
function splitEndpoints(epA, epB) {
  return epA.uuid.startsWith("output") ? [epA, epB] : [epB, epA];
}

// Sets (or, with an empty list, clears) the component that drives an input pin of a flip-flop
function setFlipFlopPin(sink, pin, source) {
  if (pin.includes("jin")) {
    sink.setJ(source);
  } else if (pin.includes("kin")) {
    sink.setK(source);
  } else if (pin.includes("din")) {
    sink.setD(source);
  } else if (pin.includes("clr")) {
    sink.setClr(source);
  } else if (pin.includes("pr")) {
    sink.setPr(source);
  } else if (pin.includes("clk")) {
    sink.setClk(source);
  }
}

// Records a new wire in the circuit model. It works the same for gates, input/output bits, the clock and the
// flip-flops, and for both directions in which a wire can be dragged.
function linkEndpoints(fromEndpoint, toEndpoint) {
  const [outEp, inEp] = splitEndpoints(fromEndpoint, toEndpoint);
  const driver = findComponent(outEp.elementId);
  const sink = findComponent(inEp.elementId);
  if (!driver || !sink) {
    return;
  }
  const pos = outputPos(driver, outEp);

  // the component that drives the wire
  if (isFlipFlop(driver)) {
    if (pos === "Q") {
      driver.addqOutput(sink);
    } else {
      driver.addqbarOutput(sink);
    }
    driver.setConnected(true, pos);
  } else {
    driver.addOutput(sink);
    driver.setConnected(true);
  }

  // the component that receives the wire
  if (isFlipFlop(sink)) {
    setFlipFlopPin(sink, pinLabel(inEp), [driver, pos]);
  } else {
    sink.addInput(driver, pos);
  }
}

// Removes a single occurrence of item from list
function removeOne(list, item) {
  const index = list.indexOf(item);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

// Removes a deleted wire from the circuit model
function unlinkEndpoints(connection, epA, epB) {
  if (!epA || !epB || !epA.uuid || !epB.uuid) {
    return;
  }
  const [outEp, inEp] = splitEndpoints(epA, epB);
  if (!outEp.uuid.startsWith("output") || !inEp.uuid.startsWith("input")) {
    return;
  }
  const driver = findComponent(outEp.elementId);
  const sink = findComponent(inEp.elementId);
  if (!driver || !sink) {
    return;
  }
  const pos = outputPos(driver, outEp);
  // the driver stays connected only if it has another wire
  const lastWire = outEp.connections.filter((c) => c !== connection).length === 0;

  if (isFlipFlop(driver)) {
    removeOne(pos === "Q" ? driver.qOutputs : driver.qbarOutputs, sink);
  } else {
    removeOne(driver.outputs, sink);
  }
  if (lastWire) {
    driver.setConnected(false, pos);
  }

  if (isFlipFlop(sink)) {
    setFlipFlopPin(sink, pinLabel(inEp), []);
  } else {
    const index = sink.inputs.findIndex(
      (pair) => pair[0] === driver && pair[1] === pos
    );
    if (index !== -1) {
      sink.inputs.splice(index, 1);
    }
  }
}

// Keep the circuit model in sync when a wire is deleted
function bindDetach() {
  jsPlumbInstance.unbind("connection:detach");
  jsPlumbInstance.bind("connection:detach", function (info) {
    unlinkEndpoints(info.connection, info.sourceEndpoint, info.targetEndpoint);
  });
}
bindDetach();

// The wires of all the tasks are handled in the same way
const bindWires = function () {
  bindDetach();
  jsPlumbInstance.unbind("beforeDrop");
  jsPlumbInstance.bind("beforeDrop", function (data) {
    const fromEndpoint = data.connection.endpoints[0];
    const toEndpoint = data.dropEndpoint;

    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    // Prevent self-connection
    if (fromEndpoint.elementId === toEndpoint.elementId) {
      return false;
    }

    // Prevent invalid connections
    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else if (
      (end_uuid === "input" && toEndpoint.connections.length > 0) ||
      (start_uuid === "input" && fromEndpoint.connections.length > 1)
    ) {
      // An input pin takes one wire only
      return false;
    }
    jsPlumbInstance.connect({
      uuids: [fromEndpoint.uuid, toEndpoint.uuid],
      paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
    });
    num_wires++;
    num_wires = num_wires % wireColours.length;
    linkEndpoints(fromEndpoint, toEndpoint);
    // the wire has been drawn above, so the drop itself is cancelled
    return false;
  });
};
export const connectGate = bindWires;
export const connectRSFF = bindWires;
export const connectJKFF = bindWires;
export const connectDFlipFlopGate = bindWires;

export const unbindEvent = () => {
  jsPlumbInstance.unbind("beforeDrop");
};

export function registerGate(id, gate) {
  const element = document.getElementById(id);
  const gateType = id.split("-")[0];

  if (
    gateType === "AND" ||
    gateType === "OR" ||
    gateType === "XOR" ||
    gateType === "XNOR" ||
    gateType === "NAND" ||
    gateType === "NOR"
  ) {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, -9],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 10],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "ThreeIPNAND") {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.15, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.85, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:2:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "NOT") {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "Input" || gateType === "Clock") {
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
      })
    );
  } else if (gateType === "Output") {
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
      })
    );
  } else if (gateType === "FullAdder") {
    // carry output
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Cout", id: "cout", location: [3, 0.2] },
          },
        ],
      })
    );
    // sum output
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 1, 0, 1, 0, 7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:1:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Sum", id: "sum", location: [0.3, -1.7] },
          },
        ],
      })
    );
    // input A0
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 0, 0, -1, -25, -7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "A0", id: "a0", location: [0.3, 1.7] },
          },
        ],
      })
    );
    // input B0
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.5, 0, 0, -1, 25, -7],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "B0", id: "b0", location: [0.3, 1.7] },
          },
        ],
      })
    );
    // carry input
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.5, 1, 0, 7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:2:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Cin", id: "cin", location: [-1, 0.2] },
          },
        ],
      })
    );
  } else if (gateType === "RSFlipFlop") {
    // input s
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.7, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
        overlays: [
          { type: "Label", options: { id: "rin", location: [3, 0.2] } },
        ],
      })
    );
    // input R
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.3, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
        overlays: [
          { type: "Label", options: { id: "sin", location: [3, 0.2] } },
        ],
      })
    );
    // input clock
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:4:" + id,
        overlays: [
          { type: "Label", options: { id: "clk", location: [3, 0.2] } },
        ],
      })
    );
    // output Q
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.3, 1, 0, 7, 1],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:2:" + id,
        overlays: [
          { type: "Label", options: { id: "qout", location: [-1, 0.2] } },
        ],
      })
    );
    // output Q'
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.7, 1, 0, 7, -1],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:3:" + id,
        overlays: [
          { type: "Label", options: { id: "qbarout", location: [-1, 0.2] } }, // qbar for q '
        ],
      })
    );
  } else if (gateType === "JKFlipFlop") {
    // input K
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.7, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
        overlays: [
          { type: "Label", options: { id: "kin", location: [3, 0.2] } },
        ],
      })
    );
    // input J
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.3, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
        overlays: [
          { type: "Label", options: { id: "jin", location: [3, 0.2] } },
        ],
      })
    );
    // input clock
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:4:" + id,
        overlays: [
          { type: "Label", options: { id: "clk", location: [3, 0.2] } },
        ],
      })
    );
    // output Q
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.3, 1, 0, 7, 1],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:2:" + id,
        overlays: [
          { type: "Label", options: { id: "qout", location: [-1, 0.2] } },
        ],
      })
    );
    // output Q'
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.7, 1, 0, 7, -1],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:3:" + id,
        overlays: [
          { type: "Label", options: { id: "qbarout", location: [-1, 0.2] } }, // qbar for q '
        ],
      })
    );
  } else if (gateType === "DFlipFlop") {
    // input D
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.31, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:1:" + id,
        overlays: [
          { type: "Label", options: { id: "din", location: [3, 0.2] } },
        ],
      })
    );
    // input clock
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.69, 0, 1, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:4:" + id,
        overlays: [
          { type: "Label", options: { id: "clk", location: [3, 0.2] } },
        ],
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.57, 0, 0, -1, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:5:" + id,
        overlays: [
          { type: "Label", options: { id: "pr", location: [-1, 0.2] } },
        ],
      })
    );
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0.57, 1, 0, 1, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:6:" + id,
        overlays: [
          { type: "Label", options: { id: "clr", location: [3, 0.2] } },
        ],
      })
    );
    // output Q
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.3, 1, 0, 7, 1],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:2:" + id,
        overlays: [
          { type: "Label", options: { id: "qout", location: [-1, 0.2] } },
        ],
      })
    );
    // output Q'
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [1, 0.7, 1, 0, 7, -1],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:3:" + id,
        overlays: [
          { type: "Label", options: { id: "qbarout", location: [-1, 0.2] } },
        ],
      })
    );
  }
}

export function initRSFlipFlop() {
  const ids = ["Input-0", "Input-1", "Output-2", "Output-3"]; // [A B Sum Carry Out]
  const types = ["Input", "Input", "Output", "Output"];
  const names = ["S", "R", "Q", "Q'"];
  const positions = [
    { x: 40, y: 650 },
    { x: 40, y: 150 },
    { x: 820, y: 275 },
    { x: 820, y: 525 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
  clockjs.addClock(0.5, 50, "working-area", 40, 400, "Clk", "Clock-0");
}

export function initJKFlipFlop() {
  const ids = ["Input-0", "Input-1", "Output-2", "Output-3"]; // [A B Sum Carry Out]
  const types = ["Input", "Input", "Output", "Output"];
  const names = ["J", "K", "Q", "Q'"];
  const positions = [
    { x: 40, y: 150 },
    { x: 40, y: 650 },
    { x: 820, y: 275 },
    { x: 820, y: 525 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
  clockjs.addClock(0.5, 50, "working-area", 40, 400, "Clk", "Clock-0");
}

export function initDFlipFlop() {
  const ids = ["Input-0", "Output-1", "Output-2", "Output-3"]; // [A B Sum Carry Out]
  const types = ["Input", "Output", "Output", "Output"];
  const names = ["Ori", "QA", "QB", "QC"];
  const positions = [
    { x: 40, y: 200 },
    { x: 820, y: 150 },
    { x: 820, y: 400 },
    { x: 820, y: 700 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
  clockjs.addClock(0.5, 50, "working-area", 40, 400, "Clk", "Clock-0");
  // Ori = 0 presets the first flip-flop and clears the other two, so the board starts with Ori = 0
  const ori = document.getElementById("Input-0");
  ori.className = "low";
  ori.childNodes[0].innerHTML = "0";
  gatejs.gates["Input-0"].setOutput(false);
}

export function initTFlipFlop() {
  const ids = ["Input-0", "Input-1", "Output-2", "Output-3"]; // [A B Sum Carry Out]
  const types = ["Input", "Input", "Output", "Output"];
  const names = ["J", "K", "QB", "QA"];
  const positions = [
    { x: 40, y: 200 },
    { x: 40, y: 550 },
    { x: 820, y: 200 },
    { x: 820, y: 550 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
  clockjs.addClock(0.5, 50, "working-area", 40, 400, "Clk", "Clock-0");
}

export function initFreqDivider() {
  const ids = ["Input-0", "Input-1", "Output-2"]; // [A B Sum Carry Out]
  const types = ["Input", "Input", "Output"];
  const names = ["J", "K", "New Clock"];
  const positions = [
    { x: 40, y: 200 },
    { x: 40, y: 550 },
    { x: 820, y: 200 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
  clockjs.addClock(0.5, 50, "working-area", 40, 400, "Clk", "Clock-0");
}

export function refreshWorkingArea() {
  jsPlumbInstance.reset();
  window.numComponents = 0;
  window.firstSimulation = true;
  gatejs.clearGates();
  flipflopjs.clearFlipFlops();
}
refresh.addEventListener("click", function () {
  gatejs.stopSimulation();
  document.getElementById("result").innerHTML = "";
  document.getElementById("table-body").innerHTML = "";
  document.getElementById("table-head").innerHTML = "";
  jsPlumbInstance.reset();
  window.numComponents = 0;
  window.firstSimulation = true;
  gatejs.clearGates();
  flipflopjs.clearFlipFlops();
  bindWires();
  if (window.currentTab == "task1") initTFlipFlop();
  else if (window.currentTab == "task2") initDFlipFlop();
  else if (window.currentTab == "task3") initFreqDivider();
});
const menu = document.querySelector(".menu");
const menuOption = document.querySelector(".menu-option");
let menuVisible = false;

console.log(menu);
console.log(menuOption);
console.log(menuVisible);

const toggleMenu = (command) => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = command === "show";
};
console.log("toggle", toggleMenu);

export const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};
console.log("setPosition", setPosition);

window.addEventListener("click", () => {
  console.log("menu is ", menuVisible);
  if (menuVisible) toggleMenu("hide");
  window.selectedComponent = null;
  window.componentType = null;
});
document.addEventListener("contextmenu", function (event) {
  // Only show custom context menu for specific elements within the working area
  const target = event.target;
  const workingArea = target.closest("#working-area");

  // Only process if we're within the working area
  if (!workingArea) {
    return; // Let browser handle context menu outside working area
  }

  const isComponent =
    target.closest(".drag-drop") ||
    target.closest(".logic-gate") ||
    target.closest(".high") ||
    target.closest(".low") ||
    target.closest(".output") ||
    target.closest(".jkflipflop") ||
    target.closest(".dflipflop") ||
    target.closest(".rsflipflop");
  const isConnection = target.closest(".jtk-connector");

  // Only prevent default context menu for actual components and connections within working area
  if (isComponent || isConnection) {
    event.preventDefault(); // Prevent the default context menu from appearing
    menu.style.display = "block";
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;

    // Store the target element and check if it's a connection
    window.contextMenuTarget = event.target;
    window.isConnectionContext =
      event.target.closest(".jtk-connector") !== null;

    var elements = document.querySelectorAll(".jtk-connector.jtk-hover");
    toggleMenu("show");
  }
  // For empty working area or non-component elements, let browser handle context menu normally
});

// Menu option click handler (moved outside to avoid multiple listeners)
menuOption.addEventListener("click", (e) => {
  if (e.target.innerHTML === "Delete") {
    if (window.isConnectionContext) {
      // Delete connection using jsPlumb API
      console.log("Attempting to delete connection");
      let connectionDeleted = false;

      // Try to delete connection that was right-clicked
      if (window.contextMenuTarget) {
        const connectorElement =
          window.contextMenuTarget.closest(".jtk-connector");
        if (connectorElement) {
          console.log("Found connector element, attempting deletion");

          // Try to find the connection by its DOM element
          try {
            // Get all connections and find the one with this canvas
            const allConnections = jsPlumbInstance.select();

            if (allConnections.entries && allConnections.entries.length > 0) {
              for (let i = 0; i < allConnections.entries.length; i++) {
                const connection = allConnections.entries[i];
                if (
                  connection.connector &&
                  connection.connector.canvas === connectorElement
                ) {
                  console.log("Found matching connection, deleting...");
                  jsPlumbInstance.deleteConnection(connection);
                  connectionDeleted = true;
                  break;
                }
              }
            }
          } catch (error) {
            console.error("Error deleting connection:", error);
          }

          // Fallback: if jsPlumb deletion didn't work, try DOM removal
          if (!connectionDeleted) {
            console.log("Fallback: removing connector element from DOM");
            try {
              if (connectorElement.parentNode) {
                connectorElement.parentNode.removeChild(connectorElement);
                connectionDeleted = true;
              }
            } catch (error) {
              console.error("Error removing connector element:", error);
            }
          }
        }
      }

      if (!connectionDeleted) {
        console.log("No specific connection found, clearing hover connections");
        var elements = document.querySelectorAll(".jtk-connector.jtk-hover");
        elements.forEach(function (element) {
          try {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          } catch (error) {
            console.error("Error removing hover element:", error);
          }
        });
      }
    } else if (window.componentType === "gate") {
      console.log("op1");
      deleteElement(window.selectedComponent);
    } else if (window.componentType === "fullAdder") {
      deleteFA(window.selectedComponent);
    } else if (window.componentType === "flipFlop") {
      deleteFF(window.selectedComponent);
    } else {
      console.log("op2");
      var elements = document.querySelectorAll(".jtk-connector.jtk-hover");
      elements.forEach(function (element) {
        try {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        } catch (error) {
          console.error("Error removing element:", error);
        }
      });
    }
  }
  // Reset context variables
  window.contextMenuTarget = null;
  window.isConnectionContext = false;
  // window.selectedComponent = null;
  // window.componentType = null;
  toggleMenu("hide"); // Hide menu after selection
});

window.currentTab = "task1";

// Initialize the page properly when it loads
document.addEventListener("DOMContentLoaded", function () {
  // Make sure toolbar is updated for initial tab
  if (typeof window.updateToolbar === "function") {
    window.updateToolbar();
  }
});

connectJKFF();
refreshWorkingArea();
initTFlipFlop();
