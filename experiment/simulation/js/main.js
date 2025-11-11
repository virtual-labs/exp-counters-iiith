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

export const connectGate = function () {
  jsPlumbInstance.bind("beforeDrop", function (data) {
    const fromEndpoint = data.connection.endpoints[0];
    const toEndpoint = data.dropEndpoint;

    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    if (fromEndpoint.elementId === toEndpoint.elementId) {
      return false;
    }

    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else if (
      (end_uuid === "input" && toEndpoint.connections.length > 0) ||
      (start_uuid === "input" && fromEndpoint.connections.length > 1)
    ) {
      // If it already has a connection, do not establish a new connection
      return false;
    } else {
      jsPlumbInstance.connect({
        uuids: [fromEndpoint.uuid, toEndpoint.uuid],
        paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
      });
      num_wires++;
      num_wires = num_wires % wireColours.length;
      if (start_uuid === "output") {
        const input = gatejs.gates[fromEndpoint.elementId];
        input.isConnected = true;
        gatejs.gates[toEndpoint.elementId].addInput(input, "");
        input.addOutput(gatejs.gates[toEndpoint.elementId]);
      } else if (end_uuid === "output") {
        const input = gatejs.gates[toEndpoint.elementId];
        input.isConnected = true;
        gatejs.gates[fromEndpoint.elementId].addInput(input, "");
        input.addOutput(gatejs.gates[fromEndpoint.elementId]);
      }
    }
  });
};

export const connectRSFF = function () {
  jsPlumbInstance.bind("beforeDrop", function (data) {
    const fromEndpoint = data.connection.endpoints[0];
    const toEndpoint = data.dropEndpoint;

    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    if (fromEndpoint.elementId === toEndpoint.elementId) {
      return false;
    }

    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else if (
      (end_uuid === "input" && toEndpoint.connections.length > 0) ||
      (start_uuid === "input" && fromEndpoint.connections.length > 1)
    ) {
      // If it already has a connection, do not establish a new connection
      return false;
    } else {
      jsPlumbInstance.connect({
        uuids: [fromEndpoint.uuid, toEndpoint.uuid],
        paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
      });
      num_wires++;
      num_wires = num_wires % wireColours.length;
      const start_type = fromEndpoint.elementId.split("-")[0];
      let end_type = toEndpoint.elementId.split("-")[0];
      if (end_type === "Clock") {
        end_type = "Input";
      }
      if (start_type === "RSFlipFlop" && end_type === "RSFlipFlop") {
        if (start_uuid === "output") {
          const input = flipflopjs.flipFlops[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
          } else if (
            Object.keys(fromEndpoint.overlays)[0].includes("qbarout")
          ) {
            pos = "Q'";
            input.addqbarOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          if (Object.keys(toEndpoint.overlays)[0].includes("rin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setR([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("sin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setS([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClk([input, pos]);
          }
        } else if (end_uuid === "output") {
          const input = flipflopjs.flipFlops[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("qbarout")) {
            pos = "Q'";
            input.addqbarOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          if (Object.keys(fromEndpoint.overlays)[0].includes("rin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setR([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("sin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setS([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClk([input, pos]);
          }
        }
      } else if (start_type === "RSFlipFlop" && end_type === "Input") {
        if (end_uuid === "output") {
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("rin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setR([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("sin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setS([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClk([input, pos]);
          }
          input.addOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
        }
      } else if (start_type === "Input" && end_type === "RSFlipFlop") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("rin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setR([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("sin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setS([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClk([input, pos]);
          }
          input.addOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
        }
      } else if (start_type === "RSFlipFlop" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = flipflopjs.flipFlops[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(gatejs.gates[toEndpoint.elementId]);
          } else if (
            Object.keys(fromEndpoint.overlays)[0].includes("qbarout")
          ) {
            pos = "Q'";
            input.addqbarOutput(gatejs.gates[toEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      } else if (start_type === "Output" && end_type === "RSFlipFlop") {
        if (start_uuid === "input") {
          const input = flipflopjs.flipFlops[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(gatejs.gates[fromEndpoint.elementId]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("qbarout")) {
            pos = "Q'";
            input.addqbarOutput(output);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      } else if (start_type === "Input" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (start_type === "Output" && end_type === "Input") {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        start_type === "RSFlipFlop" &&
        toEndpoint.elementId in gatejs.gates
      ) {
        // connection is started from the outputs of r-s flipflop
        if (start_uuid === "output") {
          // connection will end at the input of the gate
          const input = flipflopjs.flipFlops[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(output);
          } else if (
            Object.keys(fromEndpoint.overlays)[0].includes("qbarout")
          ) {
            pos = "Q'";
            input.addqbarOutput(output);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
        // connection is started from the inputs of r-s flipflop
        else if (start_uuid === "input") {
          // connection will end at the output of the gate
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("rin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setR([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("sin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setS([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClk([input, pos]);
          }

          input.addOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
        }
      } else if (
        end_type === "RSFlipFlop" &&
        fromEndpoint.elementId in gatejs.gates
      ) {
        // connection is started from the outputs of gate
        if (start_uuid === "output") {
          // connection will end at the input of r-s flipflop
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("rin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setR([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("sin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setS([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClk([input, pos]);
          }

          input.addOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
        }
        // connection is started from the inputs of gate
        else if (start_uuid === "input") {
          // connection will end at the output of the r-s flip flop

          const input = flipflopjs.flipFlops[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(output);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("qbarout")) {
            pos = "Q'";
            input.addqbarOutput(output);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      } else if (
        start_type === "Input" &&
        toEndpoint.elementId in gatejs.gates
      ) {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        fromEndpoint.elementId in gatejs.gates &&
        end_type === "Input"
      ) {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        start_type === "Output" &&
        toEndpoint.elementId in gatejs.gates
      ) {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        fromEndpoint.elementId in gatejs.gates &&
        end_type === "Output"
      ) {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        fromEndpoint.elementId in gatejs.gates &&
        toEndpoint.elementId in gatejs.gates
      ) {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        } else if (end_uuid === "output") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      }
    }
  });
};

export const connectJKFF = function () {
  jsPlumbInstance.bind("beforeDrop", function (data) {
    const fromEndpoint = data.connection.endpoints[0];
    const toEndpoint = data.dropEndpoint;

    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    if (fromEndpoint.elementId === toEndpoint.elementId) {
      return false;
    }

    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else if (
      (end_uuid === "input" && toEndpoint.connections.length > 0) ||
      (start_uuid === "input" && fromEndpoint.connections.length > 1)
    ) {
      // If it already has a connection, do not establish a new connection
      return false;
    } else {
      jsPlumbInstance.connect({
        uuids: [fromEndpoint.uuid, toEndpoint.uuid],
        paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
      });
      num_wires++;
      num_wires = num_wires % wireColours.length;
      const start_type = fromEndpoint.elementId.split("-")[0];
      let end_type = toEndpoint.elementId.split("-")[0];
      if (end_type === "Clock") {
        end_type = "Input";
      }

      if (start_type === "JKFlipFlop" && end_type === "JKFlipFlop") {
        if (start_uuid === "output") {
          const input = flipflopjs.flipFlops[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
          } else if (
            Object.keys(fromEndpoint.overlays)[0].includes("qbarout")
          ) {
            pos = "Q'";
            input.addqbarOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          if (Object.keys(toEndpoint.overlays)[0].includes("kin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setK([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("jin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setJ([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClk([input, pos]);
          }
        } else if (end_uuid === "output") {
          const input = flipflopjs.flipFlops[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("qbarout")) {
            pos = "Q'";
            input.addqbarOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          if (Object.keys(fromEndpoint.overlays)[0].includes("kin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setK([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("jin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setJ([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClk([input, pos]);
          }
        }
      } else if (start_type === "JKFlipFlop" && end_type === "Input") {
        if (end_uuid === "output") {
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("kin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setK([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("jin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setJ([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClk([input, pos]);
          }
          input.addOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
        }
      } else if (start_type === "Input" && end_type === "JKFlipFlop") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("kin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setK([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("jin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setJ([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClk([input, pos]);
          }
          input.addOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
        }
      } else if (start_type === "JKFlipFlop" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = flipflopjs.flipFlops[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(gatejs.gates[toEndpoint.elementId]);
          } else if (
            Object.keys(fromEndpoint.overlays)[0].includes("qbarout")
          ) {
            pos = "Q'";
            input.addqbarOutput(gatejs.gates[toEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      } else if (start_type === "Output" && end_type === "JKFlipFlop") {
        if (start_uuid === "input") {
          const input = flipflopjs.flipFlops[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(gatejs.gates[fromEndpoint.elementId]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("qbarout")) {
            pos = "Q'";
            input.addqbarOutput(output);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      } else if (start_type === "Input" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (start_type === "Output" && end_type === "Input") {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        start_type === "JKFlipFlop" &&
        toEndpoint.elementId in gatejs.gates
      ) {
        // connection is started from the outputs of r-s flipflop
        if (start_uuid === "output") {
          // connection will end at the input of the gate
          const input = flipflopjs.flipFlops[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(output);
          } else if (
            Object.keys(fromEndpoint.overlays)[0].includes("qbarout")
          ) {
            pos = "Q'";
            input.addqbarOutput(output);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
        // connection is started from the inputs of r-s flipflop
        else if (start_uuid === "input") {
          // connection will end at the output of the gate
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("kin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setK([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("jin")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setJ([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClk([input, pos]);
          }
          input.addOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
        }
      } else if (
        end_type === "JKFlipFlop" &&
        fromEndpoint.elementId in gatejs.gates
      ) {
        // connection is started from the outputs of gate
        if (start_uuid === "output") {
          // connection will end at the input of r-s flipflop
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("kin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setK([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("jin")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setJ([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClk([input, pos]);
          }
          input.addOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
        }
        // connection is started from the inputs of gate
        else if (start_uuid === "input") {
          // connection will end at the output of the r-s flip flop

          const input = flipflopjs.flipFlops[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(output);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("qbarout")) {
            pos = "Q'";
            input.addqbarOutput(output);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      } else if (
        start_type === "Input" &&
        toEndpoint.elementId in gatejs.gates
      ) {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        fromEndpoint.elementId in gatejs.gates &&
        end_type === "Input"
      ) {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        start_type === "Output" &&
        toEndpoint.elementId in gatejs.gates
      ) {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        fromEndpoint.elementId in gatejs.gates &&
        end_type === "Output"
      ) {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      }
      // need to check
      else if (
        fromEndpoint.elementId in gatejs.gates &&
        toEndpoint.elementId in gatejs.gates
      ) {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        } else if (end_uuid === "output") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      }
      // return true;
    }
  });
};

// D Flip Flop and gates
export const connectDFlipFlopGate = function () {
  jsPlumbInstance.bind("beforeDrop", function (data) {
    const fromEndpoint = data.connection.endpoints[0];
    const toEndpoint = data.dropEndpoint;

    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    if (fromEndpoint.elementId === toEndpoint.elementId) {
      return false;
    }

    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else if (
      (end_uuid === "input" && toEndpoint.connections.length > 0) ||
      (start_uuid === "input" && fromEndpoint.connections.length > 1)
    ) {
      // If it already has a connection, do not establish a new connection
      return false;
    } else {
      jsPlumbInstance.connect({
        uuids: [fromEndpoint.uuid, toEndpoint.uuid],
        paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
      });
      num_wires++;
      num_wires = num_wires % wireColours.length;
      const start_type = fromEndpoint.elementId.split("-")[0];
      let end_type = toEndpoint.elementId.split("-")[0];
      if (end_type === "Clock") {
        end_type = "Input";
      }
      if (start_type === "DFlipFlop" && end_type === "DFlipFlop") {
        if (start_uuid === "output") {
          const input = flipflopjs.flipFlops[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
          } else if (
            Object.keys(fromEndpoint.overlays)[0].includes("qbarout")
          ) {
            pos = "Q'";
            input.addqbarOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          if (Object.keys(toEndpoint.overlays)[0].includes("din")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setD([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClk([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("pr")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setPr([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clr")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClr([input, pos]);
          }
        } else if (end_uuid === "output") {
          const input = flipflopjs.flipFlops[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("qbarout")) {
            pos = "Q'";
            input.addqbarOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          if (Object.keys(fromEndpoint.overlays)[0].includes("din")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setD([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClk([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("pr")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setPr([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clr")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClr([input, pos]);
          }
        }
      } else if (start_type === "DFlipFlop" && end_type === "Input") {
        if (end_uuid === "output") {
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("din")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setD([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClk([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("pr")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setPr([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clr")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClr([input, pos]);
          }
          input.addOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
        }
      } else if (start_type === "Input" && end_type === "DFlipFlop") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("din")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setD([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClk([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("pr")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setPr([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clr")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClr([input, pos]);
          }
          input.addOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
        }
      } else if (start_type === "DFlipFlop" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = flipflopjs.flipFlops[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(gatejs.gates[toEndpoint.elementId]);
          } else if (
            Object.keys(fromEndpoint.overlays)[0].includes("qbarout")
          ) {
            pos = "Q'";
            input.addqbarOutput(gatejs.gates[toEndpoint.elementId]);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      } else if (start_type === "Output" && end_type === "DFlipFlop") {
        if (start_uuid === "input") {
          const input = flipflopjs.flipFlops[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(gatejs.gates[fromEndpoint.elementId]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("qbarout")) {
            pos = "Q'";
            input.addqbarOutput(output);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      } else if (start_type === "Input" && end_type === "Output") {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (start_type === "Output" && end_type === "Input") {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        start_type === "DFlipFlop" &&
        toEndpoint.elementId in gatejs.gates
      ) {
        // connection is started from the outputs of r-s flipflop
        if (start_uuid === "output") {
          // connection will end at the input of the gate
          const input = flipflopjs.flipFlops[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(output);
          } else if (
            Object.keys(fromEndpoint.overlays)[0].includes("qbarout")
          ) {
            pos = "Q'";
            input.addqbarOutput(output);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
        // connection is started from the inputs of r-s flipflop
        else if (start_uuid === "input") {
          // connection will end at the output of the gate
          const input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("din")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setD([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClk([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("pr")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setPr([input, pos]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("clr")) {
            flipflopjs.flipFlops[fromEndpoint.elementId].setClr([input, pos]);
          }
          input.addOutput(flipflopjs.flipFlops[fromEndpoint.elementId]);
        }
      } else if (
        end_type === "DFlipFlop" &&
        fromEndpoint.elementId in gatejs.gates
      ) {
        // connection is started from the outputs of gate
        if (start_uuid === "output") {
          // connection will end at the input of r-s flipflop
          const input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("din")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setD([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clk")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClk([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("pr")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setPr([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("clr")) {
            flipflopjs.flipFlops[toEndpoint.elementId].setClr([input, pos]);
          }
          input.addOutput(flipflopjs.flipFlops[toEndpoint.elementId]);
        }
        // connection is started from the inputs of gate
        else if (start_uuid === "input") {
          // connection will end at the output of the r-s flip flop

          const input = flipflopjs.flipFlops[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("qout")) {
            pos = "Q";
            input.addqOutput(output);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("qbarout")) {
            pos = "Q'";
            input.addqbarOutput(output);
          }
          input.setConnected(true, pos);
          output.addInput(input, pos);
        }
      } else if (
        start_type === "Input" &&
        toEndpoint.elementId in gatejs.gates
      ) {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        fromEndpoint.elementId in gatejs.gates &&
        end_type === "Input"
      ) {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        start_type === "Output" &&
        toEndpoint.elementId in gatejs.gates
      ) {
        if (start_uuid === "input") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      } else if (
        fromEndpoint.elementId in gatejs.gates &&
        end_type === "Output"
      ) {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      }
      // need to check
      else if (
        fromEndpoint.elementId in gatejs.gates &&
        toEndpoint.elementId in gatejs.gates
      ) {
        if (start_uuid === "output") {
          const input = gatejs.gates[fromEndpoint.elementId];
          const output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        } else if (end_uuid === "output") {
          const input = gatejs.gates[toEndpoint.elementId];
          const output = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input, "");
          input.addOutput(output);
        }
      }
    }
  });
};

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
  jsPlumbInstance.reset();
  window.numComponents = 0;
  window.firstSimulation = true;
  gatejs.clearGates();
  flipflopjs.clearFlipFlops();
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
