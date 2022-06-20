import { setCoordinates,fillInputDots,fillColor,objectDisappear,objectAppear,setColor,unsetColor} from "./animation-utility.js";
'use strict';

window.unsetOri = unsetOri;
window.unsetClock = unsetClock;
window.simulationStatus = simulationStatus;
window.restartCircuit = restartCircuit;
window.setSpeed=setSpeed;

// Dimensions of working areaS
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

const EMPTY="";
// stroing the necessary div elements in const
const STATUS = document.getElementById("play-or-pause");
const OBSERV = document.getElementById("observations");
const SPEED = document.getElementById("speed");

// global varaibles declared here
const OBJECTS = [document.getElementById("ori"),document.getElementById("clock"),document.getElementById("qa"),document.getElementById("qb"),document.getElementById("qc")];
const TEXTINPUT = [document.createElementNS(svgns, "text")];
const TEXTCLOCK = [document.createElementNS(svgns, "text")];
const TEXTOUTPUT = [document.createElementNS(svgns, "text"),document.createElementNS(svgns, "text"),document.createElementNS(svgns, "text")];
const ORIDOT = [document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle")];
const CLOCKDOT = [document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle"),document.createElementNS(svgns, "circle")];

let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });

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

// function to initialise the instruction box
function instructionBoxInit() {
    // Instruction box
    instructionBox.addEventListener("click", () => {
        instructionBox.classList.toggle("expand");
    });
}

// function to initialise the input text i.e. either 0/1 that gets displayed after user click on them
function textIOInit() {
    for( const text of TEXTINPUT){
        text.textContent = 2;
    }
}

// function to initialise clock text
function textClockInit() {
    for( const text of TEXTCLOCK){
        text.textContent = 2;
    }
}

// function to mark the output coordinates
function outputCoordinates() {
    let xcor = 297;
    let ycor = 64;
    for(const text of TEXTOUTPUT){
        setCoordinates(xcor,ycor,text);
        xcor += 200;
        svg.append(text);
    }
}

// function to mark the input dots
function inputDots() {

    for(const dot of ORIDOT){
        fillInputDots(dot,20,550,15,"#FF0000");
        svg.append(dot);
    }

    for(const dot of CLOCKDOT){
        fillInputDots(dot,20,550,15,"#FF0000");
        svg.append(dot);
    }

}

// function to disappear ori dots (1,2,3)
function oriDotDisappear() {
    for(const dot of ORIDOT){
        objectDisappear(dot);
    }
}
// function to disappear clock dots (1,2,3)
function clockDotDisappear() {
    for(const dot of CLOCKDOT){
        objectDisappear(dot);
    }
}
// function to appear ori dots (1,2,3)
function oriDotVisible() {
    for(const dot of ORIDOT){
        objectAppear(dot);
    }
}
// function to appear clock dots (1,2,3)
function clockDotVisible() {
    for(const dot of CLOCKDOT){
        objectAppear(dot);
    }
}
// function to disappear the output text
function outputDisappear() {
    for(const text of TEXTOUTPUT){
        objectDisappear(text);
    }
}
// function to appear the input text
function outputVisible() {
    for(const text of TEXTOUTPUT){
        objectAppear(text);
    }
}
// function to disappear ori text
function oriTextDisappear() {
    objectDisappear(TEXTINPUT[0]);
}
// function to disappear clock text
function clockDisappear() {
    objectDisappear(TEXTCLOCK[0]);
}
// function to appear ori text
function oriTextVisible() {
    objectAppear(TEXTINPUT[0]);
}
// function to appear clock text
function clockVisible() {
    objectAppear(TEXTCLOCK[0]);
}
function clearObservation() {
    OBSERV.innerHTML = EMPTY;
}
function allDisappear() {
    oriTextDisappear();
    oriDotDisappear();
    clockDisappear();
    clockDotDisappear();
    outputDisappear();
    for(const object of OBJECTS){
        fillColor(object,"#008000");
    }
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
function unsetOri() {
    if (TEXTINPUT[0].textContent !== "0" && timeline.progress() === 0) {
        oriTextDisappear();
        TEXTINPUT[0].textContent = 0;
        svg.appendChild(TEXTINPUT[0]);
        setCoordinates(17,554,TEXTINPUT[0]);
        fillColor(OBJECTS[0],"#eeeb22");
        clearObservation();
        oriTextVisible();

        for(const dot of ORIDOT){
            setter(TEXTINPUT[0].textContent,dot);
        }
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
    setCoordinates(17,554,TEXTINPUT[0]);
    fillColor(OBJECTS[0],"#29e");
    clearObservation();
    oriTextVisible();
    for(const dot of ORIDOT){
        setter(TEXTINPUT[0].textContent,dot);
    }
    OBSERV.innerHTML = "ori is set to 1";
}
function unsetClock() {
    if (TEXTCLOCK[0].textContent !== "0" && timeline.progress() === 0) {
        clockDisappear();
        TEXTCLOCK[0].textContent = 0;
        svg.appendChild(TEXTCLOCK[0]);
        setCoordinates(17,504,TEXTCLOCK[0]);
        fillColor(OBJECTS[1],"#eeeb22");
        clearObservation();
        clockVisible();

        for(const dot of CLOCKDOT){
            setter(TEXTCLOCK[0].textContent,dot);
        }
    }
    else if (TEXTCLOCK[0].textContent !== "1" && timeline.progress() === 0) {
        setClock();
    }
}
function setClock() {
    clockDisappear();
    TEXTCLOCK[0].textContent = 1;
    svg.appendChild(TEXTCLOCK[0]);
    setCoordinates(17,504,TEXTCLOCK[0]);
    fillColor(OBJECTS[1],"#29e");
    clearObservation();
    clockVisible();
    for(const dot of CLOCKDOT){
        setter(TEXTCLOCK[0].textContent,dot);
    }
    OBSERV.innerHTML = "Clock has Started";
}

function reboot() {
    TEXTINPUT[0].textContent = 2;
    TEXTCLOCK[0].textContent = 2;
}

function outputSetter() {
    for(let index=0;index<TEXTOUTPUT.length;index++){
        setter(TEXTOUTPUT[index].textContent, OBJECTS[index+2]);
        setter(TEXTOUTPUT[index].textContent, CLOCKDOT[index]);
    }
}
function display() {
    OBSERV.innerHTML = "Simulation has finished. Press Restart to start again"
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
    TEXTCLOCK[0].textContent = 0;
    svg.appendChild(TEXTCLOCK[0]);
    setCoordinates(17,504,TEXTCLOCK[0]);
    fillColor(OBJECTS[1],"#eeeb22");
    OBSERV.innerHTML = "Negative edge triggered change in output expected now";
}
function clockToOne() {
    TEXTCLOCK[0].textContent = 1;
    svg.appendChild(TEXTCLOCK[0]);
    setCoordinates(17,504,TEXTCLOCK[0]);
    fillColor(OBJECTS[1],"#29e");
    OBSERV.innerHTML = "No change in output";
}

function changeSpeed(newSpeed){
    if (TEXTCLOCK[0].textContent !== "2" && TEXTINPUT[0].textContent !== "2" && timeline.progress() !== 1) {
        timeline.resume();
        timeline.timeScale(newSpeed);
        OBSERV.innerHTML = "2x speed";
        decide = true;
        STATUS.innerHTML = "Pause";
    }
}
function setSpeed(speed) {
    if (circuitStarted) {
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
    if (circuitStarted) {
        circuitStarted = false;
    }
    timeline.seek(0);
    timeline.pause();
    allDisappear();
    reboot();
    clearObservation();
    decide = false;
    STATUS.innerHTML = "Start";
    OBSERV.innerHTML = "Successfully restored";
    SPEED.selectedIndex = 0;
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
        OBSERV.innerHTML = "Simulation has been stopped.";
        decide = false;
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
        if (!circuitStarted) {
            circuitStarted = true;
        }
        timeline.play();
        timeline.timeScale(1);
        OBSERV.innerHTML = "Simulation has started.";
        decide = true;
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
