import {
  connectJKFF,
  unbindEvent,
  initDFlipFlop,
  refreshWorkingArea,
  initTFlipFlop,
  connectDFlipFlopGate,
  initFreqDivider,
} from "./main.js";
import { simulate } from "./gate.js";

("use strict");

// Wires
export const wireColours = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#bf6be3",
  "#ff00ff",
  "#00ffff",
  "#ff8000",
  "#00ff80",
  "#80ff00",
  "#ff0080",
  "#8080ff",
  "#c0c0c0",
];
const EMPTY = "";
// Contextmenu

// Tabs

function changeTabs(e) {
  const task = e.target.parentNode.id;
  if (window.currentTab === task) {
    return;
  }

  // Initialize currentTab if it's null
  if (window.currentTab === undefined) {
    window.currentTab = null;
  }

  if (window.currentTab !== null) {
    const currentElement = document.getElementById(window.currentTab);
    if (currentElement) {
      currentElement.classList.remove("is-active");
    }
  }
  window.currentTab = task;
  const taskElement = document.getElementById(task);
  if (taskElement) {
    taskElement.classList.add("is-active");
  }

  // Basic Counter implementation
  if (task === "task1") {
    unbindEvent();
    connectJKFF();
    refreshWorkingArea();
    initTFlipFlop();
    window.simulate = simulate;
  } else if (task === "task2") {
    unbindEvent();
    connectDFlipFlopGate();
    refreshWorkingArea();
    initDFlipFlop();
    window.simulate = simulate;
  } else if (task === "task3") {
    unbindEvent();
    connectJKFF();
    refreshWorkingArea();
    initFreqDivider();
    window.simulate = simulate;
  }

  updateInstructions();
  updateToolbar();
  clearObservations();
  resize();
}

window.changeTabs = changeTabs;

function updateInstructions() {
  const task = window.currentTab;
  const instructionBox = document.getElementById("task-description");
  let title = "";
  if (task === "task1") {
    title = `Instructions<br>Implement a Basic Counter using JK Flip-Flops where QB is MSB and QA is LSB.`;
  } else if (task === "task2") {
    title = `Instructions<br>Implement a Ring Counter using D Flip-Flops where set bit must move from QA->QB->QC.`;
  } else if (task === "task3") {
    title = `Instructions<br>Implement a Frequency Divider circuit that has frequency which is 1/4 of the given clock.`;
  }
  instructionBox.innerHTML = title;
}

// Toolbar

function updateToolbar() {
  let elem = EMPTY;
  if (window.currentTab === "task1") {
    elem =
      '<div class="component-button jkflipflop" onclick="addJKFlipFlop(event)"></div>';
  } else if (window.currentTab === "task2") {
    elem =
      '<div class="component-button dflipflop" onclick="addDFlipFlop(event)"></div>';
  } else if (window.currentTab === "task3") {
    elem = `<div class="component-button and" onclick="addGate(event)">AND</div>
    <div class="component-button or" onclick="addGate(event)">OR</div>
    <div class="component-button not" onclick="addGate(event)">NOT</div>
    <div class="component-button nand" onclick="addGate(event)">NAND</div>
    <div class="component-button nor" onclick="addGate(event)">NOR</div>
    <div class="component-button xor" onclick="addGate(event)">XOR</div>
    <div class="component-button xnor" onclick="addGate(event)">XNOR</div>
    <div class="component-button jkflipflop" onclick="addJKFlipFlop(event)"></div>`;
  }

  const toolbar = document.getElementById("toolbar");
  if (toolbar) {
    toolbar.innerHTML = elem;
  }
}

// Make updateToolbar available globally
window.updateToolbar = updateToolbar;

// Clear observations
function clearObservations() {
  const tableBody = document.getElementById("table-body");
  const tableHead = document.getElementById("table-head");
  const result = document.getElementById("result");

  if (tableBody) tableBody.innerHTML = EMPTY;
  if (tableHead) tableHead.innerHTML = EMPTY;
  if (result) result.innerHTML = EMPTY;
}

// Simulation

const simButton = document.getElementById("simulate-button");
function toggleSimulation() {
  if (window.simulate === 0) {
    window.simulate = 1;
    if (simButton) simButton.innerHTML = "Simulate";
  } else {
    window.simulate = 0;
    if (simButton) simButton.innerHTML = "Stop";
    if (!window.sim()) {
      window.simulate = 1;
      if (simButton) simButton.innerHTML = "Simulate";
    }
  }
}

// Only add event listener if simButton exists
if (simButton) {
  simButton.addEventListener("click", toggleSimulation);
}

// Making webpage responsive

// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
if (circuitBoard) {
  // Distance of working area from top
  const circuitBoardTop = circuitBoard.offsetTop;
  // Full height of window
  const windowHeight = window.innerHeight;
  const width = window.innerWidth;
  if (width < 1024) {
    circuitBoard.style.height = "600px";
  } else {
    circuitBoard.style.height = `${windowHeight - circuitBoardTop - 20}px`;
  }
}

function resize() {
  const circuitBoard = document.getElementById("circuit-board");
  if (circuitBoard) {
    const sidePanels = document.getElementsByClassName("v-datalist-container");
    const width = window.innerWidth;

    if (width >= 1024) {
      for (let i = 0; i < sidePanels.length; i++) {
        sidePanels[i].style.height = circuitBoard.style.height;
      }
    }
  }
}

resize();
