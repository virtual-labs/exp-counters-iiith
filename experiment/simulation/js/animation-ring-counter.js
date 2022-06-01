"use strict";
// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
const sidePanels = document.getElementsByClassName("v-datalist-container");
// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;
// Full height of window

const windowHeight = window.innerHeight;
const width = window.innerWidth;
const instructionBox = document.getElementsByClassName("instructions-box")[0];

const svg = document.querySelector(".svg");
const inputpath1 = document.querySelector("#inputpath1");
const svgns = "http://www.w3.org/2000/svg";


// stroing the necessary div elements in const
const ORI = document.getElementById("ori");
const CLOCK = document.getElementById("clock");
const O1 = document.getElementById("qa");
const O2 = document.getElementById("qb");
const O3 = document.getElementById("qc");
const STATUS = document.getElementById("playOrPause");
const OBSERV = document.getElementById("Observations");
const SPEED = document.getElementById("speed");

// global varaibles declared here
const TEXTINPUT = [document.createElementNS(svgns, "text")];
const TEXTCLOCK = [document.createElementNS(svgns, "text")];
const TEXTOUTPUT = [document.createElementNS(svgns, "text"),document.createElementNS(svgns, "text"),document.createElementNS(svgns, "text")];
const ORIDOT = [document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle")];
const CLOCKDOT = [document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle")];

let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });

// decide help to decide the speed
let decide = 0;
// circuitStarted is initialised to 0 which depicts that demo hasn't started whereas circuitStarted 1 depicts that the demo has started.
let circuitStarted = 0;


// function to take care of width
function demoWidth() {
    if (width < 1024) {
        circuitBoard.style.height = 600 + "px";
    } else {
        circuitBoard.style.height = windowHeight - circuitBoardTop - 20 + "px";
    }
    sidePanels[0].style.height = circuitBoard.style.height;
}

// function to initialise the instruction box
function instructionBoxInit() {
    // Instruction box
    instructionBox.addEventListener("click", () => {
        instructionBox.classList.toggle("expand");
    });
}

function fillOutputDots(xObject,yObject,textObject){
    gsap.set(textObject,{
        x: xObject,
        y: yObject
    })
}

function fillInputDots(object,cxObject,cyObject,rObject,fillObject) {
    gsap.set(object, {
        attr: { cx: cxObject, cy: cyObject, r: rObject, fill: fillObject }
    });
}

function objectDisappear(object){
    gsap.to(object, 0, { autoAlpha: 0 });
}

function objectAppear(object){
    gsap.to(object, 0, { autoAlpha: 1 });
}

// function to initialise the input text i.e. either 0/1 that gets displayed after user click on them
function textIOInit() {
    for (let index = 0; index < TEXTINPUT.length; index++) {
        TEXTINPUT[index].textContent = 2;
    }
}

// function to initialise clock text
function textClockInit() {
    for (let index = 0; index < TEXTCLOCK.length; index++) {
        TEXTCLOCK[index].textContent = 2;
    }
}

// function to mark the output coordinates
function outputCoordinates() {
    fillOutputDots(297,64,TEXTOUTPUT[0]);
    fillOutputDots(497,64,TEXTOUTPUT[1]);
    fillOutputDots(697,64,TEXTOUTPUT[2]);
    svg.appendChild(TEXTOUTPUT[0]);
    svg.appendChild(TEXTOUTPUT[1]);
    svg.appendChild(TEXTOUTPUT[2]);
}

// function to mark the input dots
function inputDots() {
    for (let index = 0; index < ORIDOT.length; index++) {
        fillInputDots(ORIDOT[index],20,550,15,"#FF0000");
        svg.append(ORIDOT[index]);
    }
    for (let index = 0; index < CLOCKDOT.length; index++) {
        fillInputDots(CLOCKDOT[index],20,550,15,"#FF0000");
        svg.append(CLOCKDOT[index]);
    }
}

// function to disappear ori dots (1,2,3)
function oriDotDisappear() {
    for (let index = 0; index < ORIDOT.length; index++) {
        objectDisappear(ORIDOT[index]);
    }
}
// function to disappear clock dots (1,2,3)
function clockDotDisappear() {
    for (let index = 0; index < CLOCKDOT.length; index++) {
        objectDisappear(CLOCKDOT[index]);
    }
}
// function to appear ori dots (1,2,3)
function oriDotVisible() {
    for (let index = 0; index < ORIDOT.length; index++) {
        objectAppear(ORIDOT[index]);
    }
}
// function to appear clock dots (1,2,3)
function clockDotVisible() {
    for (let index = 0; index < CLOCKDOT.length; index++) {
        objectAppear(CLOCKDOT[index]);
    }
}
// function to disappear the output text
function outputDisappear() {
    for (let index = 0; index < TEXTOUTPUT.length; index++) {
        objectDisappear(TEXTOUTPUT[index]);
    }
}
// function to appear the input text
function outputVisible() {
    for (let index = 0; index < TEXTOUTPUT.length; index++) {
        objectAppear(TEXTOUTPUT[index]);
    }
}
// function to disappear ori text
function oriTextDisappear() {
    gsap.to(TEXTINPUT[0], 0, { autoAlpha: 0 });
}
// function to disappear clock text
function clockDisappear() {
    gsap.to(TEXTCLOCK[0], 0, { autoAlpha: 0 });
}
// function to appear ori text
function oriTextVisible() {
    gsap.to(TEXTINPUT[0], 0, { autoAlpha: 1 });
}
// function to appear clock text
function clockVisible() {
    gsap.to(TEXTCLOCK[0], 0, { autoAlpha: 1 });
}
function clearObservation() {
    OBSERV.innerHTML = "";
}
function allDisappear() {
    oriTextDisappear();
    oriDotDisappear();
    clockDisappear();
    clockDotDisappear();
    outputDisappear();
    gsap.set(ORI, {
        fill: "#008000"
    });
    gsap.set(CLOCK, {
        fill: "#008000"
    });
    gsap.set(O1, {
        fill: "#008000"
    });
    gsap.set(O2, {
        fill: "#008000"
    });
    gsap.set(O3, {
        fill: "#008000"
    });
}
// to set the output dots
// this will only be called once
function outputHandlerSetter() {
    TEXTOUTPUT[0].textContent = 1;
    TEXTOUTPUT[1].textContent = 0;
    TEXTOUTPUT[2].textContent = 0;

}
// shifting the outputs
function outputHandler() {
    let temp = 0;
    temp = TEXTOUTPUT[2].textContent;
    TEXTOUTPUT[2].textContent = TEXTOUTPUT[1].textContent;
    TEXTOUTPUT[1].textContent = TEXTOUTPUT[0].textContent;
    TEXTOUTPUT[0].textContent = temp;
}
function set(a) {
    gsap.set(a, {
        fill: "#eeeb22"
    });
}
function unset(a) {
    gsap.set(a, {
        fill: "#29e"
    });
}
function unsetOri() {
    if (TEXTINPUT[0].textContent !== "0" && timeline.progress() === 0) {
        oriTextDisappear();
        TEXTINPUT[0].textContent = 0;
        svg.appendChild(TEXTINPUT[0]);
        gsap.set(TEXTINPUT[0], {
            x: 17,
            y: 554
        });
        gsap.set(ORI, {
            fill: "#eeeb22"
        });
        clearObservation();
        oriTextVisible();
        setter(TEXTINPUT[0].textContent, ORIDOT[0]);
        setter(TEXTINPUT[0].textContent, ORIDOT[1]);
        setter(TEXTINPUT[0].textContent, ORIDOT[2]);
        OBSERV.innerHTML = "ori is set to 0";
    }
    else if (TEXTINPUT[0].textContent !== "1" && timeline.progress() === 0) {
        setOri();
    }
}
function setOri() {
    oriTextDisappear();
    TEXTINPUT[0].textContent = 1;
    svg.appendChild(TEXTINPUT[0]);
    gsap.set(TEXTINPUT[0], {
        x: 17,
        y: 554
    });
    gsap.set(ORI, {
        fill: "#29e"
    });
    clearObservation();
    oriTextVisible();
    setter(TEXTINPUT[0].textContent, ORIDOT[0]);
    setter(TEXTINPUT[0].textContent, ORIDOT[1]);
    setter(TEXTINPUT[0].textContent, ORIDOT[2]);
    OBSERV.innerHTML = "ori is set to 1";
}
function unsetClock() {
    if (TEXTCLOCK[0].textContent !== "0" && timeline.progress() === 0) {
        clockDisappear();
        TEXTCLOCK[0].textContent = 0;
        svg.appendChild(TEXTCLOCK[0]);
        gsap.set(TEXTCLOCK[0], {
            x: 17,
            y: 504
        });
        gsap.set(CLOCK, {
            fill: "#eeeb22"
        });
        clearObservation();
        clockVisible();
        setter(TEXTCLOCK[0].textContent, CLOCKDOT[0]);
        setter(TEXTCLOCK[0].textContent, CLOCKDOT[1]);
        setter(TEXTCLOCK[0].textContent, CLOCKDOT[2]);
    }
    else if (TEXTCLOCK[0].textContent !== "1" && timeline.progress() === 0) {
        setClock();
    }
}
function setClock() {
    clockDisappear();
    TEXTCLOCK[0].textContent = 1;
    svg.appendChild(TEXTCLOCK[0]);
    gsap.set(TEXTCLOCK[0], {
        x: 17,
        y: 504
    });
    gsap.set(CLOCK, {
        fill: "#29e"
    });
    clearObservation();
    clockVisible();
    setter(TEXTCLOCK[0].textContent, CLOCKDOT[0]);
    setter(TEXTCLOCK[0].textContent, CLOCKDOT[1]);
    setter(TEXTCLOCK[0].textContent, CLOCKDOT[2]);
    OBSERV.innerHTML = "Clock has Started";
}

function reboot() {
    TEXTINPUT[0].textContent = 2;
    TEXTCLOCK[0].textContent = 2;
}

function outputSetter() {
    setter(TEXTOUTPUT[0].textContent, O1);
    setter(TEXTOUTPUT[1].textContent, O2);
    setter(TEXTOUTPUT[2].textContent, O3);
    setter(TEXTOUTPUT[0].textContent, CLOCKDOT[0]);
    setter(TEXTOUTPUT[1].textContent, CLOCKDOT[1]);
    setter(TEXTOUTPUT[2].textContent, CLOCKDOT[2]);
}
function display() {
    OBSERV.innerHTML = "Simulation has finished. Press Restart to start again"
}
function setter(a, b) {
    if (a === "1") {
        unset(b);
    }
    else if (a === "0") {
        set(b);
    }
}
function clockToZero() {
    TEXTCLOCK[0].textContent = 0;
    svg.appendChild(TEXTCLOCK[0]);
    gsap.set(TEXTCLOCK[0], {
        x: 17,
        y: 504
    });
    gsap.set(CLOCK, {
        fill: "#eeeb22"
    });
    OBSERV.innerHTML = "Negative edge triggered change in output expected now";
}
function clockToOne() {
    TEXTCLOCK[0].textContent = 1;
    svg.appendChild(TEXTCLOCK[0]);
    gsap.set(TEXTCLOCK[0], {
        x: 17,
        y: 504
    });
    gsap.set(CLOCK, {
        fill: "#29e"
    });
    OBSERV.innerHTML = "No change in output";
}

function changeSpeed(newSpeed){
    if (TEXTCLOCK[0].textContent !== "2" && TEXTINPUT[0].textContent !== "2" && timeline.progress() !== 1) {
        timeline.resume();
        timeline.timeScale(newSpeed);
        OBSERV.innerHTML = "2x speed";
        decide = 1;
        STATUS.innerHTML = "Pause";
    }
}
function setSpeed(speed) {
    if (circuitStarted !== 0) {
        if (speed === "1") {
            changeSpeed(1);
        }
        else if (speed === "2") {
            changeSpeed(2);
        }
        else if (speed === "4") {
            changeSpeed(4);
        }
    }

}

function restartCircuit() {
    if (circuitStarted === 1) {
        circuitStarted = 0;
    }
    timeline.seek(0);
    timeline.pause();
    allDisappear();
    reboot();
    clearObservation();
    decide = 0;
    STATUS.innerHTML = "Start";
    OBSERV.innerHTML = "Successfully restored";
    SPEED.selectedIndex = 0;
}

function simulationStatus() {
    if (decide === 0) {
        startCircuit();
    }
    else if (decide === 1) {
        stopCircuit();
    }
}
function stopCircuit() {
    if (timeline.time() !== 0 && timeline.progress() !== 1) {
        timeline.pause();
        OBSERV.innerHTML = "Simulation has been stopped.";
        decide = 0;
        STATUS.innerHTML = "Start";
        SPEED.selectedIndex = 0;
    }
    else if (timeline.progress() === 1) {
        OBSERV.innerHTML = "Please Restart the simulation";
    }
}
function startCircuit() {
    if (TEXTINPUT[0].textContent !== "0" && TEXTCLOCK[0].textContent !== "0") {
        OBSERV.innerHTML = "ori and clock must be set to 0.";
    }
    else if (TEXTINPUT[0].textContent === "0" && TEXTCLOCK[0].textContent === "0" && TEXTINPUT[0].textContent !== "2" && timeline.progress() !== 1) {
        if (circuitStarted === 0) {
            circuitStarted = 1;
        }
        timeline.play();
        timeline.timeScale(1);
        OBSERV.innerHTML = "Simulation has started.";
        decide = 1;
        STATUS.innerHTML = "Pause";
        SPEED.selectedIndex = 0;
    }
    else if (TEXTINPUT[0].textContent === "2" || TEXTCLOCK[0].textcontent === "2") {
        OBSERV.innerHTML = "Please select the values";
    }
    else if (TEXTCLOCK[0].textContent !== "0" && timeline.progress() === 0) {
        OBSERV.innerHTML = "Please set the clock to 0.";
    }

    else if (timeline.progress() === 1) {
        OBSERV.innerHTML = "Please Restart the simulation";
    }
}

// all the execution begin here
gsap.registerPlugin(MotionPathPlugin);
demoWidth();
// calling all the functions that are going to initialise 
instructionBoxInit();
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
timeline.to(ORIDOT[0], {
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
timeline.to(ORIDOT[1], {
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


timeline.to(ORIDOT[2], {
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
timeline.to(CLOCKDOT[0], {
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
timeline.to(CLOCKDOT[1], {
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
timeline.to(CLOCKDOT[2], {
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
timeline.to(CLOCKDOT[0], {
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
timeline.to(CLOCKDOT[1], {
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
timeline.to(CLOCKDOT[2], {
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
