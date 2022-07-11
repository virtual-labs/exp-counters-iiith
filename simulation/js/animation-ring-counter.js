import { setCoordinates, fillInputDots, fillColor, objectDisappear, objectAppear, setColor, unsetColor } from "./animation-utility.js";
'use strict';

window.unsetOri = unsetOri;
window.unsetClock = unsetClock;
window.simulationStatus = simulationStatus;
window.restartCircuit = restartCircuit;
window.setSpeed = setSpeed;

// Dimensions of working areaS
const circuitBoard = document.getElementById("circuit-board");
const sidePanels = document.getElementsByClassName("v-datalist-container");
// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;
// Full height of window

const windowHeight = window.innerHeight;
const width = window.innerWidth;

const svg = document.querySelector(".svg");
const svgns = "http://www.w3.org/2000/svg";

const EMPTY = "";
// stroing the necessary div elements in const
const status = document.getElementById("play-or-pause");
const observ = document.getElementById("observations");
const speed = document.getElementById("speed");

// global varaibles declared here
const objects = [
    document.getElementById("ori"), 
    document.getElementById("clock"), 
    document.getElementById("qa"), 
    document.getElementById("qb"), 
    document.getElementById("qc")
];
const textInput = [document.createElementNS(svgns, "text")];
const textClock = [document.createElementNS(svgns, "text")];
const textOutput = [
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text")
];
const oriDots = [
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"), 
    document.createElementNS(svgns, "circle")
];
const clockDots = [
    document.createElementNS(svgns, "circle"), 
    document.createElementNS(svgns, "circle"), 
    document.createElementNS(svgns, "circle")
];



// decide help to decide the speed
let decide = false;
// circuitStarted is initialised to 0 which depicts that demo hasn't started whereas circuitStarted 1 depicts that the demo has started.
let circuitStarted = false;


// function to take care of width
function demoWidth() {
    if (width < 1024) {
        circuitBoard.style.height = "600px";
    } else {
        circuitBoard.style.height = `${windowHeight - circuitBoardTop - 20}px`;
    }
    sidePanels[0].style.height = circuitBoard.style.height;
}

// function to initialise the input text i.e. either 0/1 that gets displayed after user click on them
function textIOInit() {
    for (const text of textInput) {
        text.textContent = 2;
    }
}

// function to initialise clock text
function textClockInit() {
    for (const text of textClock) {
        text.textContent = 2;
    }
}

// function to mark the output coordinates
function outputCoordinates() {
    let xcor = 297;
    let ycor = 64;
    for (const text of textOutput) {
        setCoordinates(xcor, ycor, text);
        xcor += 200;
        svg.append(text);
    }
}

// function to mark the input dots
function inputDots() {

    for (const dot of oriDots) {
        fillInputDots(dot, 20, 550, 15, "#FF0000");
        svg.append(dot);
    }

    for (const dot of clockDots) {
        fillInputDots(dot, 20, 550, 15, "#FF0000");
        svg.append(dot);
    }

}

// function to disappear ori dots (1,2,3)
function oriDotDisappear() {
    for (const dot of oriDots) {
        objectDisappear(dot);
    }
}
// function to disappear clock dots (1,2,3)
function clockDotDisappear() {
    for (const dot of clockDots) {
        objectDisappear(dot);
    }
}
// function to appear ori dots (1,2,3)
function oriDotVisible() {
    for (const dot of oriDots) {
        objectAppear(dot);
    }
}
// function to appear clock dots (1,2,3)
function clockDotVisible() {
    for (const dot of clockDots) {
        objectAppear(dot);
    }
}
// function to disappear the output text
function outputDisappear() {
    for (const text of textOutput) {
        objectDisappear(text);
    }
}
// function to appear the input text
function outputVisible() {
    for (const text of textOutput) {
        objectAppear(text);
    }
}
// function to disappear ori text
function oriTextDisappear() {
    objectDisappear(textInput[0]);
}
// function to disappear clock text
function clockDisappear() {
    objectDisappear(textClock[0]);
}
// function to appear ori text
function oriTextVisible() {
    objectAppear(textInput[0]);
}
// function to appear clock text
function clockVisible() {
    objectAppear(textClock[0]);
}
function clearObservation() {
    observ.innerHTML = EMPTY;
}
function allDisappear() {
    oriTextDisappear();
    oriDotDisappear();
    clockDisappear();
    clockDotDisappear();
    outputDisappear();
    for (const object of objects) {
        fillColor(object, "#008000");
    }
}
// to set the output dots
// this will only be called once
function outputHandlerSetter() {
    textOutput[0].textContent = 1;
    textOutput[1].textContent = 0;
    textOutput[2].textContent = 0;

}
// shifting the outputs
function outputHandler() {
    let temp = 0;
    temp = textOutput[2].textContent;
    textOutput[2].textContent = textOutput[1].textContent;
    textOutput[1].textContent = textOutput[0].textContent;
    textOutput[0].textContent = temp;
}
function unsetOri() {
    if (textInput[0].textContent !== "0" && timeline.progress() === 0) {
        oriTextDisappear();
        textInput[0].textContent = 0;
        svg.appendChild(textInput[0]);
        setCoordinates(17, 554, textInput[0]);
        fillColor(objects[0], "#eeeb22");
        clearObservation();
        oriTextVisible();

        for (const dot of oriDots) {
            setter(textInput[0].textContent, dot);
        }
        observ.innerHTML = "ori is set to 0";
    }
    else if (textInput[0].textContent !== "1" && timeline.progress() === 0) {
        setOri();
    }
}
function setOri() {
    oriTextDisappear();
    textInput[0].textContent = 1;
    svg.appendChild(textInput[0]);
    setCoordinates(17, 554, textInput[0]);
    fillColor(objects[0], "#29e");
    clearObservation();
    oriTextVisible();
    for (const dot of oriDots) {
        setter(textInput[0].textContent, dot);
    }
    observ.innerHTML = "ori is set to 1";
}
function unsetClock() {
    if (textClock[0].textContent !== "0" && timeline.progress() === 0) {
        clockDisappear();
        textClock[0].textContent = 0;
        svg.appendChild(textClock[0]);
        setCoordinates(17, 504, textClock[0]);
        fillColor(objects[1], "#eeeb22");
        clearObservation();
        clockVisible();

        for (const dot of clockDots) {
            setter(textClock[0].textContent, dot);
        }
    }
    else if (textClock[0].textContent !== "1" && timeline.progress() === 0) {
        setClock();
    }
}
function setClock() {
    clockDisappear();
    textClock[0].textContent = 1;
    svg.appendChild(textClock[0]);
    setCoordinates(17, 504, textClock[0]);
    fillColor(objects[1], "#29e");
    clearObservation();
    clockVisible();
    for (const dot of clockDots) {
        setter(textClock[0].textContent, dot);
    }
    observ.innerHTML = "Clock has Started";
}

function reboot() {
    textInput[0].textContent = 2;
    textClock[0].textContent = 2;
}

function outputSetter() {
    for (let index = 0; index < textOutput.length; index++) {
        setter(textOutput[index].textContent, objects[index + 2]);
        setter(textOutput[index].textContent, clockDots[index]);
    }
}
function display() {
    observ.innerHTML = "Simulation has finished. Press Restart to start again"
}
function setter(value, component) {
    if (value === "1") {
        unsetColor(component);
    }
    else if (value === "0") {
        setColor(component);
    }
}
function clockToZero() {
    textClock[0].textContent = 0;
    svg.appendChild(textClock[0]);
    setCoordinates(17, 504, textClock[0]);
    fillColor(objects[1], "#eeeb22");
    observ.innerHTML = "Negative edge triggered change in output expected now";
}
function clockToOne() {
    textClock[0].textContent = 1;
    svg.appendChild(textClock[0]);
    setCoordinates(17, 504, textClock[0]);
    fillColor(objects[1], "#29e");
    observ.innerHTML = "No change in output";
}

function setSpeed(speed) {
    if (circuitStarted) {
        timeline.timeScale(parseInt(speed));
        observ.innerHTML = `${speed}x speed`;
    }
}

function restartCircuit() {
    circuitStarted = false;
    timeline.seek(0);
    timeline.pause();
    allDisappear();
    reboot();
    clearObservation();
    decide = false;
    status.innerHTML = "Start";
    observ.innerHTML = "Successfully restored";
    speed.selectedIndex = 0;
}

function simulationStatus() {
    if (!decide) {
        startCircuit();
    }
    else if (decide) {
        stopCircuit();
    }
}
function stopCircuit() {
    if (timeline.time() !== 0 && timeline.progress() !== 1) {
        timeline.pause();
        observ.innerHTML = "Simulation has been stopped.";
        decide = false;
        status.innerHTML = "Start";
        speed.selectedIndex = 0;
    }
    else if (timeline.progress() === 1) {
        observ.innerHTML = "Please Restart the simulation";
    }
}
function startCircuit() {
    if (circuitStarted) {
        timeline.play();
        timeline.timeScale(1);
        observ.innerHTML = "Simulation has started";
        decide = true;
        status.innerHTML = "Pause";
        speed.selectedIndex = 0;
    }
    else {
        if (textInput[0].textContent === "0" && textClock[0].textContent === "0" && timeline.progress() !== 1) {
            circuitStarted = true;
            timeline.play();
            timeline.timeScale(1);
            observ.innerHTML = "Simulation has started.";
            decide = true;
            status.innerHTML = "Pause";
            speed.selectedIndex = 0;
        }
        else {
            observ.innerHTML = "Clock and ORI must be set to 0 before starting the simulation";
        }
        if (timeline.progress() === 1) {
            observ.innerHTML = "Please Restart the simulation";
        }
    }
}

// all the execution begin here
let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });
gsap.registerPlugin(MotionPathPlugin);
demoWidth();
// calling all the functions that are going to initialise 
textIOInit();
textClockInit();
outputCoordinates();
inputDots();
outputDisappear();

// calling functions according to the time 
timeline.add(oriDotVisible, 0);
timeline.add(oriDotDisappear, 7);
timeline.add(outputHandlerSetter, 7);
timeline.add(outputSetter, 7);
timeline.add(outputVisible, 7);
timeline.add(setOri, 8);
timeline.add(clockToOne, 8);
timeline.add(clockToZero, 15);
timeline.add(clockDotVisible, 15);
timeline.add(clockDotDisappear, 20);
timeline.add(outputHandler, 21);
timeline.add(outputSetter, 21);
timeline.add(outputVisible, 21);
timeline.add(clockToOne, 22);
timeline.add(clockToZero, 29);
timeline.add(clockDotVisible, 29);
timeline.add(clockDotDisappear, 34);
timeline.add(outputHandler, 33);
timeline.add(outputSetter, 34);
timeline.add(outputVisible, 34);
timeline.add(display, 34);
timeline.eventCallback("onComplete", outputVisible);
timeline.eventCallback("onComplete", display);


// animations with appropriate delays
timeline.to(oriDots[0], {
    motionPath: {
        path: "#path6",
        align: "#path6",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 7,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(oriDots[1], {
    motionPath: {
        path: "#path7",
        align: "#path7",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 7,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);


timeline.to(oriDots[2], {
    motionPath: {
        path: "#path8",
        align: "#path8",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 7,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(clockDots[0], {
    motionPath: {
        path: "#path9",
        align: "#path9",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 5,
    delay: 15,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(clockDots[1], {
    motionPath: {
        path: "#path10",
        align: "#path10",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 5,
    delay: 15,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(clockDots[2], {
    motionPath: {
        path: "#path11",
        align: "#path11",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 5,
    delay: 15,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(clockDots[0], {
    motionPath: {
        path: "#path9",
        align: "#path9",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 5,
    delay: 29,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(clockDots[1], {
    motionPath: {
        path: "#path10",
        align: "#path10",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 5,
    delay: 29,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);
timeline.to(clockDots[2], {
    motionPath: {
        path: "#path11",
        align: "#path11",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },
    duration: 4,
    delay: 29,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,
}, 0);

timeline.pause();
oriDotDisappear();
clockDotDisappear();
