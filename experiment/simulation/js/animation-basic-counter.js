import { setCoordinates, fillInputDots, objectDisappear, objectAppear, fillColor, setColor, unsetColor } from "./animation-utility.js";
'use strict';

window.unsetI1 = unsetI1;
window.unsetI2 = unsetI2;
window.unsetClock = unsetClock;
window.simulationStatus = simulationStatus;
window.restartCircuit = restartCircuit;
window.setSpeed = setSpeed;
// Dimensions of working area
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
const status = document.getElementById("play-or-pause");
const observ = document.getElementById("observations");
const speed = document.getElementById("speed");

const OBJECTS = [
    document.getElementById("j"), 
    document.getElementById("k"), 
    document.getElementById("j"), 
    document.getElementById("k"), 
    document.getElementById("clock"), 
    document.getElementById("qb"), 
    document.getElementById("qa")
];
const TEXTINPUT = [
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text")
];
const TEXTCLOCK = [document.createElementNS(svgns, "text")];
const TEXTOUTPUT = [
    document.createElementNS(svgns, "text"), 
    document.createElementNS(svgns, "text")
];
const CLOCKDOTS = [document.createElementNS(svgns, "circle")];
const INPUTDOTS = [
    document.createElementNS(svgns, "circle"), 
    document.createElementNS(svgns, "circle"), 
    document.createElementNS(svgns, "circle"), 
    document.createElementNS(svgns, "circle")
];

let decide = false;
let circuitStarted = false;

function demoWidth() {
    if (width < 1024) {
        circuitBoard.style.height = "600px";
    } else {
        circuitBoard.style.height = `${windowHeight - circuitBoardTop - 20}px`;
    }
    sidePanels[0].style.height = circuitBoard.style.height;
}

//initialise input text
function textIOInit() {
    for (const text of TEXTINPUT) {
        text.textContent = 2;
    }
}
//initialise clock text
function textClockInit() {
    for (const text of TEXTCLOCK) {
        text.textContent = 2;
    }
}

function outputCoordinates() {

    let xcor = 596;
    let ycor = 154;
    let gap = 325;

    for (const text of TEXTOUTPUT) {
        setCoordinates(xcor, ycor, text);
        ycor += gap;
        svg.append(text);
    }
}



function inputDots() {
    //sets the coordinates of the input dots
    for (let index = 0; index < INPUTDOTS.length; index++) {
        if (index === 0 || index === 1) {
            fillInputDots(INPUTDOTS[index], 50, 50, 15, "#FF0000");
        }
        else if (index == 2 || index == 3) {
            fillInputDots(INPUTDOTS[index], 50, 250, 15, "#FF0000");
        }

        svg.append(INPUTDOTS[index]);
    }

}
function jkDotDisappear() {
    for (const dot of INPUTDOTS) {
        objectDisappear(dot);
    }
}

function clockDotDisappear() {
    //makes the clock dot disappear
    for (const dot of CLOCKDOTS) {
        objectDisappear(dot);
    }
}
function jkDotVisible() {
    //makes the J,K dots appear
    for (const dot of INPUTDOTS) {
        objectAppear(dot);
    }
}

function clockDotVisible() {
    //makes the clock dot appear
    for (const dot of CLOCKDOTS) {
        objectAppear(dot);
    }
}
function outputDisappear() {
    //makes the output text disappear
    for (const text of TEXTOUTPUT) {
        objectDisappear(text);
    }
}
function outputVisible() {
    //makes the output text appear
    for (const text of TEXTOUTPUT) {
        objectAppear(text);
    }
}
function jDisappear() {
    //makes the J text disappear

    for (let index = 0; index < TEXTINPUT.length; index += 2) {
        objectDisappear(TEXTINPUT[index]);
    }

}
function kDisappear() {
    //makes the K text disappear

    for (let index = 1; index < TEXTINPUT.length; index += 2) {
        objectDisappear(TEXTINPUT[index]);
    }
}


function clockDisappear() {
    //makes the clock text disappear
    for (const text of TEXTCLOCK) {
        objectDisappear(text);
    }
}

function jVisible() {
    //makes the J text appear
    for (let index = 0; index < TEXTINPUT.length; index += 2) {
        objectAppear(TEXTINPUT[index]);
    }
}
function kVisible() {
    //makes the K text appear

    for (let index = 1; index < TEXTINPUT.length; index += 2) {
        objectAppear(TEXTINPUT[index]);
    }
}
function clockVisible() {
    //makes the clock text appear
    for (const text of TEXTCLOCK) {
        objectAppear(text);
    }
}

function clearObservation() {

    observ.innerHTML = EMPTY;
}

function allDisappear() {
    jDisappear();
    kDisappear();


    jkDotDisappear();
    clockDisappear();
    clockDotDisappear();
    outputDisappear();
    for (const object of OBJECTS) {
        fillColor(object, "#008000");
    }
}

function outputHandlerSetter() {
    //to set output dots
    //this is called only once
    for (const text of TEXTOUTPUT) {
        text.textContent = 1;
    }
}

function outputHandler() {
    //changes the outputs
    if (TEXTOUTPUT[1].textContent === "1" && TEXTOUTPUT[0].textContent === "1") {
        TEXTOUTPUT[0].textContent = "0";
        TEXTOUTPUT[1].textContent = "0";
    }
    else if (TEXTOUTPUT[1].textContent === "1" && TEXTOUTPUT[0].textContent === "0") {
        TEXTOUTPUT[0].textContent = "1";
        TEXTOUTPUT[1].textContent = "0";
    }
    else {
        TEXTOUTPUT[1].textContent = "1";
    }
}
function unsetI1() {
    if (TEXTINPUT[0].textContent !== "0" && timeline.progress() === 0) {
        jDisappear();
        TEXTINPUT[0].textContent = 0;
        TEXTINPUT[2].textContent = 0;
        svg.appendChild(TEXTINPUT[0]);
        svg.appendChild(TEXTINPUT[2]);
        setCoordinates(46, 155, TEXTINPUT[0]);
        setCoordinates(46, 155, TEXTINPUT[2]);

        fillColor(OBJECTS[0], "#eeeb22");
        fillColor(OBJECTS[2], "#eeeb22");
        clearObservation();
        jVisible();
        for (let index = 0; index < INPUTDOTS.length; index += 2) {
            setter(TEXTINPUT[index].textContent, INPUTDOTS[index]);
        }

        observ.innerHTML = "J is set to 0";
    }
    else if (TEXTINPUT[0] !== "1" && timeline.progress() === 0) {
        setI1();
    }
}
function setI1() {
    jDisappear();

    TEXTINPUT[0].textContent = 1;
    TEXTINPUT[2].textContent = 1;
    svg.appendChild(TEXTINPUT[0]);
    svg.appendChild(TEXTINPUT[2]);

    setCoordinates(46, 155, TEXTINPUT[0]);
    setCoordinates(46, 155, TEXTINPUT[2]);

    fillColor(OBJECTS[0], "#29e");
    fillColor(OBJECTS[2], "#29e");
    clearObservation();
    jVisible();

    for (let index = 0; index < INPUTDOTS.length; index += 2) {
        setter(TEXTINPUT[index].textContent, INPUTDOTS[index]);
    }

    observ.innerHTML = "J is set to 1";

}
function unsetI2() {

    if (TEXTINPUT[1].textContent !== "0" && timeline.progress() === 0) {
        kDisappear();
        TEXTINPUT[1].textContent = 0;
        TEXTINPUT[3].textContent = 0;
        svg.appendChild(TEXTINPUT[1]);
        svg.appendChild(TEXTINPUT[3]);
        setCoordinates(46, 630, TEXTINPUT[1]);
        setCoordinates(46, 630, TEXTINPUT[3]);

        fillColor(OBJECTS[1], "#eeeb22");
        fillColor(OBJECTS[3], "#eeeb22");
        clearObservation();
        kVisible();

        for (let index = 1; index < INPUTDOTS.length; index += 2) {
            setter(TEXTINPUT[index].textContent, INPUTDOTS[index]);
        }

        observ.innerHTML = "K is set to 0";
    }
    else if (TEXTINPUT[1] !== "1" && timeline.progress() === 0) {
        setI2();
    }
}
function setI2() {

    kDisappear();
    TEXTINPUT[1].textContent = 1;
    TEXTINPUT[3].textContent = 1;
    svg.appendChild(TEXTINPUT[1]);
    svg.appendChild(TEXTINPUT[3]);
    setCoordinates(46, 630, TEXTINPUT[1]);
    setCoordinates(46, 630, TEXTINPUT[3]);
    fillColor(OBJECTS[1], "#29e");
    fillColor(OBJECTS[3], "#29e");
    clearObservation();
    kVisible();
    for (let index = 1; index < INPUTDOTS.length; index += 2) {
        setter(TEXTINPUT[index].textContent, INPUTDOTS[index]);
    }
    observ.innerHTML = "K is set to 1";

}
function clockToZero() {
    TEXTCLOCK[0].textContent = 0;
    svg.appendChild(TEXTCLOCK[0]);
    setCoordinates(46, 405, TEXTCLOCK[0]);
    fillColor(OBJECTS[4], "#eeeb22");
    observ.innerHTML = "Negative edge triggered change in output expected now";
}
function clockToOne() {

    TEXTCLOCK[0].textContent = 1;
    svg.appendChild(TEXTCLOCK[0]);
    setCoordinates(46, 405, TEXTCLOCK[0]);
    fillColor(OBJECTS[4], "#29e");
    observ.innerHTML = "No change in output";
}


function unsetClock() {

    if (TEXTCLOCK[0].textContent !== "0" && timeline.progress() === 0) {
        clockDisappear();
        TEXTCLOCK[0].textContent = 0;
        svg.appendChild(TEXTCLOCK[0]);
        setCoordinates(46, 405, TEXTCLOCK[0]);
        fillColor(OBJECTS[4], "#eeeb22");
        clearObservation();
        clockVisible();

        for (const dot of CLOCKDOTS) {
            setter(TEXTCLOCK[0].textContent, dot);
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
    setCoordinates(46, 405, TEXTCLOCK[0]);
    fillColor(OBJECTS[4], "#29e");
    clearObservation();
    clockVisible();
    for (const dot of CLOCKDOTS) {
        setter(TEXTCLOCK[0].textContent, dot);
    }
    observ.innerHTML = "Clock has Started";

}
function reboot() {
    for (const text of TEXTINPUT) {
        text.textContent = 2;
    }
    for (const text of TEXTCLOCK) {
        text.textContent = 2;
    }
}

function outputSetter() {

    for (let index = 0; index < TEXTOUTPUT.length; index++) {
        setter(TEXTOUTPUT[index].textContent, OBJECTS[index + 5]);
    }

}


function display() {
    observ.innerHTML = "Simulation has finished. Press Restart to start again"
}
function setter(value, component) {
    //toggles the text content a of input/output component b
    if (value === "1") {
        unsetColor(component);

    }
    else if (value === "0") {
        setColor(component);
    }
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
        observ.innerHTML = "Simulation has started.";
        decide = true;
        status.innerHTML = "Pause";
        speed.selectedIndex = 0;
    }
    else {
        if (TEXTINPUT[0].textContent !== "1" || TEXTINPUT[2].textContent !== "1") {
            observ.innerHTML = "J must be set to 1.";
        }
        else if (TEXTINPUT[1].textContent !== "1" || TEXTINPUT[3].textContent !== "1") {
            observ.innerHTML = "K must be set to 1.";
        }
        else if (TEXTCLOCK[0].textContent === "0" && TEXTINPUT[0].textContent !== "2" && TEXTINPUT[2].textContent !== "2" && TEXTINPUT[1].textContent !== "2" && TEXTINPUT[3].textContent !== "2" && timeline.progress() !== 1) {
            circuitStarted = true;
            timeline.play();
            timeline.timeScale(1);
            observ.innerHTML = "Simulation has started.";
            decide = true;
            status.innerHTML = "Pause";
            speed.selectedIndex = 0;
        }
        else if (TEXTINPUT[0].textContent === "2" || TEXTINPUT[1].textContent === "2" || TEXTINPUT[2].textContent === "2" || TEXTINPUT[3].textContent === "2" || TEXTCLOCK[0].textcontent === "2") {
            observ.innerHTML = "Please select the values";
        }
        else if (TEXTCLOCK[0].textContent !== "0" && timeline.progress() === 0) {
            observ.innerHTML = "Please setup the clock.";
        }
        else if (timeline.progress() === 1) {
            observ.innerHTML = "Please Restart the simulation";
        }
    }
}
//execution starts here
let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });
gsap.registerPlugin(MotionPathPlugin);
demoWidth();
textIOInit();
textClockInit();
outputCoordinates();
inputDots();
outputDisappear();
// calling all the functions that are going to initialise 

timeline.add(jkDotVisible, 0);

timeline.add(clockDotVisible, 0);

timeline.add(clockDotDisappear, 10);

timeline.add(jkDotDisappear, 10);
timeline.add(outputHandlerSetter, 10);
timeline.add(outputSetter, 10);
timeline.add(outputVisible, 10);

timeline.add(clockToOne, 11);
timeline.add(clockToZero, 15);

timeline.add(outputHandler, 15);
timeline.add(outputSetter, 15);
timeline.add(outputVisible, 15);
timeline.add(clockToOne, 19);
timeline.add(clockToZero, 23);

timeline.add(outputHandler, 23);
timeline.add(outputSetter, 23);
timeline.add(outputVisible, 23);

timeline.add(clockToOne, 27);
timeline.add(clockToZero, 31);

timeline.add(outputHandler, 31);
timeline.add(outputSetter, 31);
timeline.add(outputVisible, 31);

timeline.add(clockToOne, 35);
timeline.add(clockToZero, 39);


timeline.add(outputHandler, 39);
timeline.add(outputSetter, 39);
timeline.add(outputVisible, 39);

timeline.add(display, 40);

timeline.eventCallback("onComplete", outputVisible);
timeline.eventCallback("onComplete", display);

// animations with appropriate delays
timeline.to(INPUTDOTS[0], {
    motionPath: {
        path: "#path1",
        align: "#path1",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 10,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(INPUTDOTS[2], {
    motionPath: {
        path: "#path2",
        align: "#path2",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 4,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);




timeline.to(INPUTDOTS[3], {
    motionPath: {
        path: "#path5",
        align: "#path5",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 9,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(INPUTDOTS[1], {
    motionPath: {
        path: "#path4",
        align: "#path4",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 5,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);



timeline.pause();

jkDotDisappear();
jkDotDisappear();

clockDotDisappear();