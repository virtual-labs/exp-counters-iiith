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
const ORI = document.getElementById("ORI");
const CLOCK = document.getElementById("CLOCK");
const O1 = document.getElementById("QA");
const O2 = document.getElementById("QB");
const O3 = document.getElementById("QC");
const BUTTON = document.getElementById("play/pause");
const OBSERV = document.getElementById("Observations");
const SPEED = document.getElementById("speed");

// global varaibles declared here
let textORI = document.createElementNS(svgns, "text");
let textClock = document.createElementNS(svgns, "text");
let textO1 = document.createElementNS(svgns, "text");
let textO2 = document.createElementNS(svgns, "text");
let textO3 = document.createElementNS(svgns, "text");
let oriDot1 = document.createElementNS(svgns, "circle");
let oriDot2 = document.createElementNS(svgns, "circle");
let oriDot3 = document.createElementNS(svgns, "circle");
let clockDot1 = document.createElementNS(svgns, "circle");
let clockDot2 = document.createElementNS(svgns, "circle");
let clockDot3 = document.createElementNS(svgns, "circle");
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

// function to initialise the input text i.e. either 0/1 that gets displayed after user click on them
function textIOInit() {
    textORI.textContent = 2;
}

// function to initialise clock text
function textClockInit() {
    textClock.textContent = 2;
}

// function to mark the output coordinates
function outputCoordinates() {
    gsap.set(textO1, {
        x: 297,
        y: 64
    });
    gsap.set(textO2, {
        x: 497,
        y: 64
    });
    gsap.set(textO3, {
        x: 697,
        y: 64
    });
    svg.appendChild(textO1);
    svg.appendChild(textO2);
    svg.appendChild(textO3);
}

// function to mark the input dots
function inputDots() {
    gsap.set(oriDot1, {
        attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
    });
    gsap.set(oriDot2, {
        attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
    });
    gsap.set(oriDot3, {
        attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
    });
    gsap.set(clockDot1, {
        attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
    });
    gsap.set(clockDot2, {
        attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
    });
    gsap.set(clockDot3, {
        attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
    });

    svg.appendChild(oriDot1);
    svg.appendChild(oriDot2);
    svg.appendChild(oriDot3);
    svg.appendChild(clockDot1);
    svg.appendChild(clockDot2);
    svg.appendChild(clockDot3);
}

// function to disappear ori dots (1,2,3)
function oriDotDisappear() {
    TweenLite.to(oriDot1, 0, { autoAlpha: 0 });
    TweenLite.to(oriDot2, 0, { autoAlpha: 0 });
    TweenLite.to(oriDot3, 0, { autoAlpha: 0 });
    
}
// function to disappear clock dots (1,2,3)
function clockDotDisappear() {
    TweenLite.to(clockDot1, 0, { autoAlpha: 0 });
    TweenLite.to(clockDot2, 0, { autoAlpha: 0 });
    TweenLite.to(clockDot3, 0, { autoAlpha: 0 });
}
// function to appear ori dots (1,2,3)
function oriDotVisible() {
    TweenLite.to(oriDot1, 0, { autoAlpha: 1 });
    TweenLite.to(oriDot2, 0, { autoAlpha: 1 });
    TweenLite.to(oriDot3, 0, { autoAlpha: 1 });
}
// function to appear clock dots (1,2,3)
function clockDotVisible() {
    TweenLite.to(clockDot1, 0, { autoAlpha: 1 });
    TweenLite.to(clockDot2, 0, { autoAlpha: 1 });
    TweenLite.to(clockDot3, 0, { autoAlpha: 1 });
}
// function to disappear the output text
function outputDisappear() {
    TweenLite.to(textO1, 0, { autoAlpha: 0 });
    TweenLite.to(textO2, 0, { autoAlpha: 0 });
    TweenLite.to(textO3, 0, { autoAlpha: 0 });
}
// function to appear the input text
function outputVisible() {
    TweenLite.to(textO1, 0, { autoAlpha: 1 });
    TweenLite.to(textO2, 0, { autoAlpha: 1 });
    TweenLite.to(textO3, 0, { autoAlpha: 1 });
}
// function to disappear ori text
function oriTextDisappear() {
    TweenLite.to(textORI, 0, { autoAlpha: 0 });
}
// function to disappear clock text
function clockDisappear() {
    TweenLite.to(textClock, 0, { autoAlpha: 0 });
}
// function to appear ori text
function oriTextVisible() {
    TweenLite.to(textORI, 0, { autoAlpha: 1 });
}
// function to appear clock text
function clockVisible() {
    TweenLite.to(textClock, 0, { autoAlpha: 1 });
}
function free() {
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
    textO1.textContent = 1;
    textO2.textContent = 0;
    textO3.textContent = 0;

}
// shifting the outputs
function outputHandler() {
    let temp = 0;
    temp = textO3.textContent;
    textO3.textContent = textO2.textContent;
    textO2.textContent = textO1.textContent;
    textO1.textContent = temp;
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
    if (textORI.textContent != 0 && timeline.progress() == 0) {
        oriTextDisappear();
        textORI.textContent = 0;
        svg.appendChild(textORI);
        gsap.set(textORI, {
            x: 17,
            y: 554
        });
        gsap.set(ORI, {
            fill: "#eeeb22"
        });
        free();
        oriTextVisible();
        setter(textORI.textContent, oriDot1);
        setter(textORI.textContent, oriDot2);
        setter(textORI.textContent, oriDot3);
        OBSERV.innerHTML = "ori is set to 0";
    }
    else if (textORI.textContent != 1 && timeline.progress() == 0) {
        setOri();
    }
}
function setOri() {
    oriTextDisappear();
    textORI.textContent = 1;
    svg.appendChild(textORI);
    gsap.set(textORI, {
        x: 17,
        y: 554
    });
    gsap.set(ORI, {
        fill: "#29e"
    });
    free();
    oriTextVisible();
    setter(textORI.textContent, oriDot1);
    setter(textORI.textContent, oriDot2);
    setter(textORI.textContent, oriDot3);
    OBSERV.innerHTML = "ori is set to 1";
}
function unsetClock() {
    if (textClock.textContent != 0 && timeline.progress() == 0) {
        clockDisappear();
        textClock.textContent = 0;
        svg.appendChild(textClock);
        gsap.set(textClock, {
            x: 17,
            y: 504
        });
        gsap.set(CLOCK, {
            fill: "#eeeb22"
        });
        free();
        clockVisible();
        setter(textClock.textContent, clockDot1);
        setter(textClock.textContent, clockDot2);
        setter(textClock.textContent, clockDot3);
    }
    else if (textClock.textContent != 1 && timeline.progress() == 0) {
        setClock();
    }
}
function setClock() {
    clockDisappear();
    textClock.textContent = 1;
    svg.appendChild(textClock);
    gsap.set(textClock, {
        x: 17,
        y: 504
    });
    gsap.set(CLOCK, {
        fill: "#29e"
    });
    free();
    clockVisible();
    setter(textClock.textContent, clockDot1);
    setter(textClock.textContent, clockDot2);
    setter(textClock.textContent, clockDot3);
    OBSERV.innerHTML = "Clock has Started";
}

function reboot() {
    textORI.textContent = 2;
    textClock.textContent = 2;
}

function outputSetter() {
    setter(textO1.textContent, O1);
    setter(textO2.textContent, O2);
    setter(textO3.textContent, O3);
    setter(textO1.textContent, clockDot1);
    setter(textO2.textContent, clockDot2);
    setter(textO3.textContent, clockDot3);
}
function display() {
    OBSERV.innerHTML = "Simulation has finished. Press Restart to start again"
}
function setter(a, b) {
    if (a == 1) {
        unset(b);
    }
    else if (a == 0) {
        set(b);
    }
}
function clockToZero() {
    textClock.textContent = 0;
    svg.appendChild(textClock);
    gsap.set(textClock, {
        x: 17,
        y: 504
    });
    gsap.set(CLOCK, {
        fill: "#eeeb22"
    });
    OBSERV.innerHTML = "Negative edge triggered change in output expected now";
}
function clockToOne() {
    textClock.textContent = 1;
    svg.appendChild(textClock);
    gsap.set(textClock, {
        x: 17,
        y: 504
    });
    gsap.set(CLOCK, {
        fill: "#29e"
    });
    OBSERV.innerHTML = "No change in output";
}

function fourXspeed() {
    if (textClock.textContent != 2 && textORI.textContent != 2 && timeline.progress() != 1) {
        timeline.resume();
        timeline.timeScale(4);
        OBSERV.innerHTML = "4x speed";
        decide = 1;
        BUTTON.innerHTML = "Pause";
    }
}
function oneXspeed() {
    if (textClock.textContent != 2 && textORI.textContent != 2 && timeline.progress() != 1) {
        timeline.resume();
        timeline.timeScale(1);
        OBSERV.innerHTML = "1x speed";
        decide = 1;
        BUTTON.innerHTML = "Pause";
    }
}
function doubleSpeed() {
    if (textClock.textContent != 2 && textORI.textContent != 2 && timeline.progress() != 1) {
        timeline.resume();
        timeline.timeScale(2);
        OBSERV.innerHTML = "2x speed";
        decide = 1;
        BUTTON.innerHTML = "Pause";
    }
}
function setSpeed(speed) {
    if (circuitStarted != 0) {
        if (speed == "1") {
            oneXspeed();
        }
        else if (speed == "2") {
            doubleSpeed();
        }
        else if (speed == "4") {
            fourXspeed();
        }
    }

}

function restartCircuit() {
    if (circuitStarted == 1) {
        circuitStarted = 0;
    }
    timeline.seek(0);
    timeline.pause();
    allDisappear();
    reboot();
    free();
    decide = 0;
    BUTTON.innerHTML = "Start";
    OBSERV.innerHTML = "Successfully restored";
    SPEED.selectedIndex = 0;
}

function button() {
    if (decide == 0) {
        startCircuit();
    }
    else if (decide == 1) {
        stopCircuit();
    }
}
function stopCircuit() {
    if (timeline.time() != 0 && timeline.progress() != 1) {
        timeline.pause();
        OBSERV.innerHTML = "Simulation has been stopped.";
        decide = 0;
        BUTTON.innerHTML = "Start";
        SPEED.selectedIndex = 0;
    }
    else if (timeline.progress() == 1) {
        OBSERV.innerHTML = "Please Restart the simulation";
    }
}
function startCircuit() {
    if (textORI.textContent != 0 && textClock.textContent != 0) {
        OBSERV.innerHTML = "ori and clock must be set to 0.";
    }
    else if (textORI.textContent == 0 && textClock.textContent == 0 && textORI.textContent != 2 && timeline.progress() != 1) {
        if (circuitStarted == 0) {
            circuitStarted = 1;
        }
        timeline.play();
        timeline.timeScale(1);
        OBSERV.innerHTML = "Simulation has started.";
        decide = 1;
        BUTTON.innerHTML = "Pause";
        SPEED.selectedIndex = 0;
    }
    else if (textORI.textContent == 2 || textClock.textcontent == 2) {
        OBSERV.innerHTML = "Please select the values";
    }
    else if (textClock.textContent != 0 && timeline.progress() == 0) {
        OBSERV.innerHTML = "Please set the clock to 0.";
    }

    else if (timeline.progress() == 1) {
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
timeline.to(oriDot1, {
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
timeline.to(oriDot2, {
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


timeline.to(oriDot3, {
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
timeline.to(clockDot1, {
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
timeline.to(clockDot2, {
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
timeline.to(clockDot3, {
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
timeline.to(clockDot1, {
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
timeline.to(clockDot2, {
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
timeline.to(clockDot3, {
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
