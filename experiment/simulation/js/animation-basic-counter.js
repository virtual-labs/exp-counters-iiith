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

const I1 = document.getElementById("j");
const I2 = document.getElementById("k");
const I3 = document.getElementById("j");
const I4 = document.getElementById("k");

const CLOCK = document.getElementById("clock");
const O1 = document.getElementById("qb");
const O2 = document.getElementById("qa");
const STATUS = document.getElementById("playOrPause");
const OBSERV = document.getElementById("Observations");

const SPEED = document.getElementById("speed");


const textI1 = document.createElementNS(svgns, "text");
const textI2 = document.createElementNS(svgns, "text");
const textI3 = document.createElementNS(svgns, "text");
const textI4 = document.createElementNS(svgns, "text");
const textClock = document.createElementNS(svgns, "text");
const textO1 = document.createElementNS(svgns, "text");
const textO2 = document.createElementNS(svgns, "text");


let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });
let decide = 0;
let circuitStarted = 0;
const jDot1 = document.createElementNS(svgns, "circle");
const jDot2 = document.createElementNS(svgns, "circle");
const clockDot = document.createElementNS(svgns, "circle");
const kDot1 = document.createElementNS(svgns, "circle");
const kDot2 = document.createElementNS(svgns, "circle");

function demoWidth() {
    if (width < 1024) {
        circuitBoard.style.height = 600 + "px";
    } else {
        circuitBoard.style.height = windowHeight - circuitBoardTop - 20 + "px";
    }
    sidePanels[0].style.height = circuitBoard.style.height;
}
// Instruction box
function instructionBoxInit() {
    instructionBox.addEventListener("click", (e) => {
        instructionBox.classList.toggle("expand");
    });
}


function textIOInit() {
    textI1.textContent = 2;
    textI2.textContent = 2;
    textI3.textContent = 2;
    textI4.textContent = 2;
}
function textClockInit() {
    textClock.textContent = 2;
}

function outputCoordinates() {
    gsap.set(textO1, {
        x: 596,
        y: 154
    });
    gsap.set(textO2, {
        x: 596,
        y: 479
    });
    svg.appendChild(textO1);

    svg.appendChild(textO2);
}

function inputDots() {
    //sets the coordinates of the input dots
    gsap.set(jDot1, {
        attr: { cx: 50, cy: 50, r: 15, fill: "#FF0000" }
    });
    gsap.set(jDot2, {
        attr: { cx: 50, cy: 50, r: 15, fill: "#FF0000" }
    });
    gsap.set(clockDot, {
        attr: { cx: 50, cy: 400, r: 15, fill: "#FF0000" }
    });

    gsap.set(kDot1, {
        attr: { cx: 50, cy: 250, r: 15, fill: "#FF0000" }
    });

    gsap.set(kDot2, {
        attr: { cx: 50, cy: 250, r: 15, fill: "#FF0000" }
    });

    svg.appendChild(jDot1);
    svg.appendChild(jDot2);
    svg.appendChild(kDot1);
    svg.appendChild(kDot2);

    svg.appendChild(clockDot);
}

function jkDotDisappear() {
    //makes the J,K dots disappear
    gsap.to(jDot1, 0, { autoAlpha: 0 });
    gsap.to(jDot2, 0, { autoAlpha: 0 });
    gsap.to(kDot1, 0, { autoAlpha: 0 });
    gsap.to(kDot2, 0, { autoAlpha: 0 });
}

function clockDotDisappear() {
    //makes the clock dot disappear
    gsap.to(clockDot, 0, { autoAlpha: 0 });

}
function jkDotVisible() {
    //makes the J,K dots appear
    gsap.to(jDot1, 0, { autoAlpha: 1 });
    gsap.to(jDot2, 0, { autoAlpha: 1 });
    gsap.to(kDot1, 0, { autoAlpha: 1 });
    gsap.to(kDot2, 0, { autoAlpha: 1 });
    

}

function clockDotVisible() {
    //makes the clock dot appear
    gsap.to(clockDot, 0, { autoAlpha: 1 });

}
function outputDisappear() {
    //makes the output text disappear
    gsap.to(textO1, 0, { autoAlpha: 0 });
    gsap.to(textO2, 0, { autoAlpha: 0 });

}
function outputVisible() {
    //makes the output text appear
    gsap.to(textO1, 0, { autoAlpha: 1 });
    gsap.to(textO2, 0, { autoAlpha: 1 });

}
function jDisappear() {
    //makes the J text disappear
    gsap.to(textI1, 0, { autoAlpha: 0 });
    gsap.to(textI3, 0, { autoAlpha: 0 });
}
function kDisappear() {
    //makes the K text disappear
    gsap.to(textI2, 0, { autoAlpha: 0 });
    gsap.to(textI4, 0, { autoAlpha: 0 });
}


function clockDisappear() {
    //makes the clock text disappear
    gsap.to(textClock, 0, { autoAlpha: 0 });
}
function clearObservation() {

    OBSERV.innerHTML = "";
}
function jVisible() {
    //makes the J text appear
    gsap.to(textI1, 0, { autoAlpha: 1 });
    gsap.to(textI3, 0, { autoAlpha: 1 });
}
function kVisible() {
    //makes the K text appear
    gsap.to(textI2, 0, { autoAlpha: 1 });
    gsap.to(textI4, 0, { autoAlpha: 1 });
}
function clockVisible() {
    //makes the clock text appear
    gsap.to(textClock, 0, { autoAlpha: 1 });
}



function allDisappear() {
    jDisappear();
    kDisappear();


    jkDotDisappear();
    clockDisappear();
    clockDotDisappear();
    outputDisappear();
    gsap.set(I1, {

        fill: "#008000"
    });
    gsap.set(I2, {

        fill: "#008000"
    });
    gsap.set(I3, {

        fill: "#008000"
    });
    gsap.set(I4, {

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


}

function outputHandlerSetter() {
    //to set output dots
    //this is called only once
    textO1.textContent = 1;
    textO2.textContent = 1;

}

function outputHandler() {
    //changes the outputs
    if (textO2.textContent === "1" && textO1.textContent === "1") {
        textO1.textContent = 0;
        textO2.textContent = 0;
    }
    else if (textO2.textContent === "1" && textO1.textContent ==="0") {
        textO2.textContent = 0;
        textO1.textContent = 1;
    }
    else if (textO2.textContent === "0" && textO1.textContent === "1") {

        textO2.textContent = 1;
    }
    else if (textO2.textContent === "0" && textO1.textContent === "0") {

        textO2.textContent = 1;
    }

}
function set(a) {
    gsap.set(a, {

        fill: "#eeeb22"
    });
}//output 0
function unset(a) {
    gsap.set(a, {

        fill: "#29e"
    });
}//output 1
function unsetI1() {
    if (textI1.textContent !== "0" && timeline.progress() === 0) {
        jDisappear();
        textI1.textContent = 0;
        textI3.textContent = 0;
        svg.appendChild(textI1);
        svg.appendChild(textI3);
        gsap.set(textI1, {
            x: 46,
            y: 155
        });
        gsap.set(textI3, {
            x: 46,
            y: 155
        });
        gsap.set(I1, {

            fill: "#eeeb22"
        });
        gsap.set(I3, {

            fill: "#eeeb22"
        });
        clearObservation();
        jVisible();
        setter(textI1.textContent, jDot1);
        setter(textI3.textContent, jDot2);

        OBSERV.innerHTML = "J is set to 0";
    }
    else if (textI1.textContent !== "1" && timeline.progress() === 0) {
        setI1();
    }




}
function setI1() {
    jDisappear();
    textI1.textContent = 1;
    textI3.textContent = 1;
    svg.appendChild(textI1);
    svg.appendChild(textI3);
    gsap.set(textI1, {
        x: 46,
        y: 155
    });
    gsap.set(I1, {

        fill: "#29e"
    });
    gsap.set(textI3, {
        x: 46,
        y: 155
    });
    gsap.set(I3, {

        fill: "#29e"
    });
    clearObservation();
    jVisible();
    
    setter(textI1.textContent, jDot1);
    setter(textI3.textContent, jDot2);

    OBSERV.innerHTML = "J is set to 1";

}
function unsetI2() {
    if (textI2.textContent !== "0" && timeline.progress() === 0) {
        kDisappear();
        textI2.textContent = 0;
        textI4.textContent = 0;
        svg.appendChild(textI2);
        svg.appendChild(textI4);
        gsap.set(textI2, {
            x: 46,
            y: 630
        });
        gsap.set(I2, {

            fill: "#eeeb22"
        });
        gsap.set(textI4, {
            x: 46,
            y: 630
        });
        gsap.set(I4, {

            fill: "#eeeb22"
        });
        clearObservation();
        kVisible();
        
        setter(textI2.textContent, kDot1);
        setter(textI4.textContent, kDot2);

        OBSERV.innerHTML = "K is set to 0";
    }
    else if (textI2.textContent !== "1" && timeline.progress() === 0) {
        setI2();
    }




}
function setI2() {
    kDisappear();
    textI2.textContent = 1;
    textI4.textContent = 1;
    svg.appendChild(textI2);
    svg.appendChild(textI4);
    gsap.set(textI2, {
        x: 46,
        y: 630
    });
    gsap.set(I2, {

        fill: "#29e"
    });
    gsap.set(textI4, {
        x: 46,
        y: 630
    });
    gsap.set(I4, {

        fill: "#29e"
    });
    clearObservation();
    kVisible();
    
    setter(textI2.textContent, kDot1);
    setter(textI4.textContent, kDot2);

    OBSERV.innerHTML = "K is set to 1";

}
function clockToZero() {
    textClock.textContent = 0;
    svg.appendChild(textClock);
    gsap.set(textClock, {
        x: 46,
        y: 405
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
        x: 46,
        y: 405
    });
    gsap.set(CLOCK, {
        fill: "#29e"
    });
    OBSERV.innerHTML = "No change in output";
}


function unsetClock() {
    if (textClock.textContent !== "0" && timeline.progress() === 0) {
        clockDisappear();
        textClock.textContent = 0;
        svg.appendChild(textClock);
        gsap.set(textClock, {
            x: 46,
            y: 405
        });
        gsap.set(CLOCK, {

            fill: "#eeeb22"
        });
        clearObservation();
        clockVisible();
        setter(textClock.textContent, clockDot);

        

    }
    else if (textClock.textContent !== "1" && timeline.progress() === 0) {
        setClock();
    }

}
function setClock() {
    clockDisappear();
    textClock.textContent = 1;
    svg.appendChild(textClock);
    gsap.set(textClock, {
        x: 46,
        y: 405
    });
    gsap.set(CLOCK, {

        fill: "#29e"
    });
    clearObservation();
    clockVisible();
    setter(textClock.textContent, clockDot);
    OBSERV.innerHTML = "Clock has Started";

}
function reboot() {
    textI1.textContent = 2;
    textI2.textContent = 2;
    textI3.textContent = 2;
    textI4.textContent = 2;


    textClock.textContent = 2;

}

function outputSetter() {
    setter(textO1.textContent, O1);
    setter(textO2.textContent, O2);

}


function display() {
    OBSERV.innerHTML = "Simulation has finished. Press Restart to start again"
}
function setter(a, b) {
    //toggles the text content a of input/output component b
    if (a === "1") {
        unset(b);

    }
    else if (a === "0") {
        set(b);
    }
}
outputDisappear();

function changeSpeed(newSpeed) {
    if (textI1.textContent !== "2" && textI3.textContent !== "2" && textI2.textContent !== "2" && textI4.textContent !== "2" && timeline.progress() !== 1) {
        timeline.resume();
        timeline.timeScale(newSpeed);
        OBSERV.innerHTML = newSpeed + "x speed";
        decide = 1;
        STATUS.innerHTML = "Pause";
    }
}
function setSpeed(speed) {
    if (circuitStarted != 0) {


        if (speed === "1") {
            startCircuit();            
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
    if (circuitStarted === 0) {
        circuitStarted = 1;
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
    if (textI1.textContent !== "1" || textI3.textContent !== "1") {
        OBSERV.innerHTML = "J must be set to 1.";
    }
    else if (textI2.textContent !== "1" || textI4.textContent !== "1") {
        OBSERV.innerHTML = "K must be set to 1.";
    }
    else if (textClock.textContent === "0" && textI1.textContent !== "2" && textI3.textContent !== "2" && textI2.textContent !== "2" && textI4.textContent !== "2" && timeline.progress() !== 1) {
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
    else if (textI1.textContent === "2" || textI2.textContent === "2" || textI3.textContent === "2" || textI4.textContent === "2" || textClock.textcontent === "2") {
        OBSERV.innerHTML = "Please select the values";
    }
    else if (textClock.textContent !== "0" && timeline.progress() === 0) {
        OBSERV.innerHTML = "Please setup the clock.";
    }

    else if (timeline.progress() === 1) {
        OBSERV.innerHTML = "Please Restart the simulation";
    }
}
//execution starts here
demoWidth();
instructionBoxInit();
textIOInit();
textClockInit();
outputCoordinates();
inputDots();
gsap.registerPlugin(MotionPathPlugin);

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
timeline.to(jDot1, {
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
timeline.to(jDot2, {
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




timeline.to(kDot2, {
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
timeline.to(kDot1, {
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



