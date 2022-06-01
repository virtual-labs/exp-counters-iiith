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

const I1 = document.getElementById("SERIALINPUT1");
const I2 = document.getElementById("SERIALINPUT2");
const I3 = document.getElementById("SERIALINPUT1");
const I4 = document.getElementById("SERIALINPUT2");

const CLOCK = document.getElementById("CLOCK");
const O1 = document.getElementById("SERIALOUTPUT1");
const O2 = document.getElementById("SERIALOUTPUT2");
const BUTTON = document.getElementById("play/pause");
const OBSERV = document.getElementById("Observations");

const SPEED = document.getElementById("speed");

if (width < 1024) {
  circuitBoard.style.height = 600 + "px";
} else {
  circuitBoard.style.height = windowHeight - circuitBoardTop - 20 + "px";
}
sidePanels[0].style.height = circuitBoard.style.height;

// Instruction box
instructionBox.addEventListener("click", (e) => {
  instructionBox.classList.toggle("expand");
});
gsap.registerPlugin(MotionPathPlugin);


let textI1 = document.createElementNS(svgns, "text");
let textI2 = document.createElementNS(svgns, "text");
let textI3 = document.createElementNS(svgns, "text");
let textI4 = document.createElementNS(svgns, "text");
let textClock = document.createElementNS(svgns, "text");
let textO1 = document.createElementNS(svgns, "text");
let textO2 = document.createElementNS(svgns, "text");

let temp = 0;
let tl = gsap.timeline({ repeat: 0, repeatDelay: 0 });
let decide = 0;
let circuitStarted = 0;
let jDot1 = document.createElementNS(svgns, "circle");
let jDot2 = document.createElementNS(svgns, "circle");
let clockDot = document.createElementNS(svgns, "circle");
let kDot1 = document.createElementNS(svgns, "circle");
let kDot2 = document.createElementNS(svgns, "circle");
textI1.textContent = 2;
textI2.textContent = 2;
textI3.textContent = 2;
textI4.textContent = 2;


textClock.textContent = 2;
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
//svg.appendChild(serialDot2);

function myFunction() {
    OBSERV.innerHTML = "";
}


function serialDotDisappear() {
    TweenLite.to(jDot1, 0, { autoAlpha: 0 });
    TweenLite.to(jDot2, 0, { autoAlpha: 0 });
    TweenLite.to(kDot1, 0, { autoAlpha: 0 });
    TweenLite.to(kDot2, 0, { autoAlpha: 0 });
   // TweenLite.to(serialDot2, 0, { autoAlpha: 0 });
    
}

function clockDotDisappear() {
    TweenLite.to(clockDot, 0, { autoAlpha: 0 });

}
function serialDotVisible() {
    TweenLite.to(jDot1, 0, { autoAlpha: 1 });
    TweenLite.to(jDot2, 0, { autoAlpha: 1 });
    TweenLite.to(kDot1, 0, { autoAlpha: 1 });
    TweenLite.to(kDot2, 0, { autoAlpha: 1 });
    //TweenLite.to(serialDot2, 0, { autoAlpha: 1 });
    
}

function clockDotVisible() {
    TweenLite.to(clockDot, 0, { autoAlpha: 1 });

}
function outputDisappear() {
    TweenLite.to(textO1, 0, { autoAlpha: 0 });
    TweenLite.to(textO2, 0, { autoAlpha: 0 });
    
}
function outputVisible() {
    TweenLite.to(textO1, 0, { autoAlpha: 1 });
    TweenLite.to(textO2, 0, { autoAlpha: 1 });
    
}
function serialDisappear1() {
    TweenLite.to(textI1, 0, { autoAlpha: 0 });
    TweenLite.to(textI3, 0, { autoAlpha: 0 });
}
function serialDisappear2() {
    TweenLite.to(textI2, 0, { autoAlpha: 0 });
    TweenLite.to(textI4, 0, { autoAlpha: 0 });
}
function serialDisappear3() {
    //TweenLite.to(textI1, 0, { autoAlpha: 0 });
    TweenLite.to(textI3, 0, { autoAlpha: 0 });
}
function serialDisappear4() {
    //TweenLite.to(textI2, 0, { autoAlpha: 0 });
    TweenLite.to(textI4, 0, { autoAlpha: 0 });
}

function clockDisappear() {
    TweenLite.to(textClock, 0, { autoAlpha: 0 });
}
function free() {
    OBSERV.innerHTML = "";
}
function serialVisible1() {
    TweenLite.to(textI1, 0, { autoAlpha: 1 });
    TweenLite.to(textI3, 0, { autoAlpha: 1 });
}
function serialVisible2() {
    TweenLite.to(textI2, 0, { autoAlpha: 1 });
    TweenLite.to(textI4, 0, { autoAlpha: 1 });
}
function serialVisible3() {
    //TweenLite.to(textI1, 0, { autoAlpha: 1 });
    TweenLite.to(textI3, 0, { autoAlpha: 1 });
}
function serialVisible4() {
    //TweenLite.to(textI2, 0, { autoAlpha: 1 });
    TweenLite.to(textI4, 0, { autoAlpha: 1 });
}

function clockVisible() {
    TweenLite.to(textClock, 0, { autoAlpha: 1 });
}



function allDisappear() {
    serialDisappear1();
    serialDisappear2();
    
    
    serialDotDisappear();
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
function outputDot() {
    gsap.set(O1, {

        fill: "#008000"
    });
    gsap.set(O2, {

        fill: "#008000"
    });
    
}
function outputHandlerSetter() {
    textO1.textContent = 1;
    textO2.textContent = 1;
    
}

function outputHandler() { 
    
    if(textO2.textContent==1 && textO1.textContent==1){
        textO1.textContent = 0;
        textO2.textContent = 0;
    }
    else if(textO2.textContent==1 && textO1.textContent==0){
        textO2.textContent = 0;
        textO1.textContent=1;
    }
    else if(textO2.textContent==0 && textO1.textContent==1){
        
        textO2.textContent = 1;
    }
    else if(textO2.textContent==0 && textO1.textContent==0){
        
        textO2.textContent=1;
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
function appendI1() {
    if (textI1.textContent != 0 && tl.progress() == 0) {
        serialDisappear1();
        textI1.textContent = 0;
        textI3.textContent = 0;
        svg.appendChild(textI1);
        svg.appendChild(textI3);
        gsap.set(textI1, {
            x: 46,
            y: 150
        });
        gsap.set(textI3, {
            x: 46,
            y: 150
        });
        gsap.set(I1, {

            fill: "#eeeb22"
        });
        gsap.set(I3, {

            fill: "#eeeb22"
        });
        free();
        serialVisible1();
        errno();
        setter(textI1.textContent, jDot1);
        setter(textI3.textContent, jDot2);

        OBSERV.innerHTML = "J is set to 0";
    }
    else if (textI1.textContent != 1 && tl.progress() == 0) {
        appendI1To1();
    }




}
function appendI1To1() {
    serialDisappear1();
    textI1.textContent = 1;
    textI3.textContent = 1;
    svg.appendChild(textI1);
    svg.appendChild(textI3);
    gsap.set(textI1, {
        x: 46,
        y: 150
    });
    gsap.set(I1, {

        fill: "#29e"
    });
    gsap.set(textI3, {
        x: 46,
        y: 150
    });
    gsap.set(I3, {

        fill: "#29e"
    });
    free();
    serialVisible1();
    errno();
    setter(textI1.textContent, jDot1);
    setter(textI3.textContent, jDot2);

    OBSERV.innerHTML = "J is set to 1";

}
function appendI2() {
    if (textI2.textContent != 0 && tl.progress() == 0) {
        serialDisappear2();
        console.log("here");
        textI2.textContent = 0;
        textI4.textContent = 0;
        svg.appendChild(textI2);
        svg.appendChild(textI4);
        gsap.set(textI2, {
            x: 46,
            y: 625
        });
        gsap.set(I2, {

            fill: "#eeeb22"
        });
        gsap.set(textI4, {
            x: 46,
            y: 625
        });
        gsap.set(I4, {

            fill: "#eeeb22"
        });
        free();
        serialVisible2();
        errno();
        setter(textI2.textContent, kDot1);
        setter(textI4.textContent, kDot2);

        OBSERV.innerHTML = "K is set to 0";
    }
    else if (textI2.textContent != 1 && tl.progress() == 0) {
        appendI2To1();
    }




}
function appendI2To1() {
    serialDisappear2();
    textI2.textContent = 1;
    textI4.textContent = 1;
    svg.appendChild(textI2);
    svg.appendChild(textI4);
    gsap.set(textI2, {
        x: 46,
        y: 625
    });
    gsap.set(I2, {

        fill: "#29e"
    });
    gsap.set(textI4, {
        x: 46,
        y: 625
    });
    gsap.set(I4, {

        fill: "#29e"
    });
    free();
    serialVisible2();
    errno();
    setter(textI2.textContent, kDot1);
    setter(textI4.textContent, kDot2);

    OBSERV.innerHTML = "K is set to 1";

}
function clockto0() {
    textClock.textContent = 0;
    svg.appendChild(textClock);
    gsap.set(textClock, {
        x: 46,
        y: 400
    });
    gsap.set(CLOCK, {
        fill: "#eeeb22"
    });
    OBSERV.innerHTML = "Negative edge triggered change in output expected now";
}
function clockto1() {
    textClock.textContent = 1;
    svg.appendChild(textClock);
    gsap.set(textClock, {
        x: 46,
        y: 400
    });
    gsap.set(CLOCK, {
        fill: "#29e"
    });
    OBSERV.innerHTML = "No change in output";
}


function appendClock() {
    if (textClock.textContent != 0 && tl.progress() == 0) {
        clockDisappear();
        textClock.textContent = 0;
        svg.appendChild(textClock);
        gsap.set(textClock, {
            x: 46,
            y: 400
        });
        gsap.set(CLOCK, {

            fill: "#eeeb22"
        });
        free();
        clockVisible();
        setter(textClock.textContent, clockDot);

        errno();

    }
    else if (textClock.textContent != 1 && tl.progress() == 0) {
        appendClockTo1();
    }

}
function appendClockTo1() {
    clockDisappear();
    textClock.textContent = 1;
    svg.appendChild(textClock);
    gsap.set(textClock, {
        x: 46,
        y: 400
    });
    gsap.set(CLOCK, {

        fill: "#29e"
    });
    free();
    clockVisible();
    setter(textClock.textContent, clockDot);

    errno();
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

function errno() {

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
outputDisappear();


function fourXspeed() {
    if (textI1.textContent != 2 && textI3.textContent != 2 && textI2.textContent != 2  &&  textI4.textContent != 2 && tl.progress() != 1) {
        tl.resume();
        tl.timeScale(4);
        OBSERV.innerHTML = "4x speed";
        decide = 1;
        BUTTON.innerHTML = "Pause";
    }
}
function doubleSpeed() {
    if ( textI1.textContent != 2 && textI3.textContent != 2 && textI2.textContent != 2  &&  textI4.textContent != 2 && tl.progress() != 1) {
        tl.resume();
        tl.timeScale(2);
        OBSERV.innerHTML = "2x speed";
        decide = 1;
        BUTTON.innerHTML = "Pause";
    }
}
function SetSpeed(speed) {
    if (circuitStarted != 0) {
        
    
    if (speed == "1") {
        startCircuit();
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
    if (circuitStarted == 0) {
        circuitStarted = 1;
    }
    tl.seek(0);
    tl.pause();
    allDisappear();
    reboot();
    myFunction();
    decide = 0;
    BUTTON.innerHTML = "Start";
    OBSERV.innerHTML = "Successfully restored";
    SPEED.selectedIndex=0;
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
    if (tl.time() != 0 && tl.progress() != 1) {
        tl.pause();
        OBSERV.innerHTML = "Simulation has been stopped.";
        decide = 0;
        BUTTON.innerHTML = "Start";
        SPEED.selectedIndex=0;
    }
    else if (tl.progress() == 1) {
        OBSERV.innerHTML = "Please Restart the simulation";
    }
}

function startCircuit() {
    if (textI1.textContent != 1 || textI3.textContent != 1  ) {
        OBSERV.innerHTML = "J must be set to 1.";
        console.log(textI1.textContent);
        console.log(textI2.textContent);
        console.log(textI3.textContent);
        console.log(textI4.textContent);
    }
    else if (textI2.textContent != 1  || textI4.textContent != 1) {
        OBSERV.innerHTML = "K must be set to 1.";
    }
    else if (textClock.textContent == 0 && textI1.textContent != 2 && textI3.textContent!=2 && textI2.textContent != 2 && textI4.textContent!=2  && tl.progress() != 1) {
        if (circuitStarted == 0) {
            circuitStarted = 1;
        }
        tl.play();
        tl.timeScale(1);
        OBSERV.innerHTML = "Simulation has started.";
        decide = 1;
        BUTTON.innerHTML = "Pause";
        SPEED.selectedIndex=0;
    }
    else if (textI1.textContent == 2 || textI2.textContent == 2  || textI3.textContent==2 || textI4.textContent==2 || textClock.textcontent == 2) {
        OBSERV.innerHTML = "Please select the values";
        console.log(textI1.textContent);
        console.log(textI2.textContent);
        console.log(textI3.textContent);
        console.log(textI4.textContent);
    }
    else if (textClock.textContent != 0 && tl.progress()==0) {
        OBSERV.innerHTML = "Please setup the clock.";
    }
    
    else if (tl.progress() == 1) {
        OBSERV.innerHTML = "Please Restart the simulation";
    }
}
tl.add(serialDotVisible, 0);

tl.add(clockDotVisible, 0);

tl.add(clockDotDisappear, 10);

tl.add(serialDotDisappear, 10);
// tl.add(selectDisappear, 10);
// tl.add(selectVisibleTo1, 10);
tl.add(outputHandlerSetter, 10);
tl.add(outputSetter, 10);
tl.add(outputVisible, 10);

tl.add(clockto1, 11);
tl.add(clockto0, 15);
//tl.add(outputDisappear, 15);
//tl.add(outputDot, 15);
tl.add(outputHandler, 15);
tl.add(outputSetter, 15);
tl.add(outputVisible, 15);
//tl.add(outputDisappear, 20);
//tl.add(outputDot, 20);
tl.add(clockto1, 19);
tl.add(clockto0, 23);

tl.add(outputHandler, 23);
tl.add(outputSetter, 23);
tl.add(outputVisible, 23);

tl.add(clockto1, 27);
tl.add(clockto0, 31);

//tl.add(outputDisappear, 25);
//tl.add(outputDot, 25);
tl.add(outputHandler, 31);
tl.add(outputSetter, 31);
tl.add(outputVisible, 31);

tl.add(clockto1, 35);
tl.add(clockto0, 39);


tl.add(outputHandler, 39);
tl.add(outputSetter, 39);
tl.add(outputVisible, 39);

tl.add(display, 40);

tl.eventCallback("onComplete", outputVisible);
tl.eventCallback("onComplete", display);


tl.to(jDot1, {
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
tl.to(jDot2, {
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




tl.to(kDot2, {
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
tl.to(kDot1, {
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



tl.pause();

serialDotDisappear();
serialDotDisappear();

clockDotDisappear();



