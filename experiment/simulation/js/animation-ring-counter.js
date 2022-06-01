"use strict";
// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
const sidePanels = document.getElementsByClassName("v-datalist-container");
// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;
// Full height of window
const windowHeight = window.innerHeight;
const width = window.innerWidth;
if (width < 1024) {
    circuitBoard.style.height = 600 + "px";
} else {
    circuitBoard.style.height = windowHeight - circuitBoardTop - 20 + "px";
}
sidePanels[0].style.height = circuitBoard.style.height;
// Instruction box
const instructionBox = document.getElementsByClassName("instructions-box")[0];
instructionBox.addEventListener("click", (e) => {
    instructionBox.classList.toggle("expand");
});
const svg = document.querySelector(".svg");
const inputpath1 = document.querySelector("#inputpath1");
const svgns = "http://www.w3.org/2000/svg";
gsap.registerPlugin(MotionPathPlugin);
let textI1 = document.createElementNS(svgns, "text");
let textClock = document.createElementNS(svgns, "text");
let textO1 = document.createElementNS(svgns, "text");
let textO2 = document.createElementNS(svgns, "text");
let textO3 = document.createElementNS(svgns, "text");
textI1.textContent = 2;
textClock.textContent = 2;
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
const I1 = document.getElementById("ORI");
const CLOCK = document.getElementById("CLOCK");
const O1 = document.getElementById("QA");
const O2 = document.getElementById("QB");
const O3 = document.getElementById("QC");
const BUTTON = document.getElementById("play/pause");
const OBSERV = document.getElementById("Observations");
let oriDot1 = document.createElementNS(svgns, "circle");
gsap.set(oriDot1, {
    attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
});
let oriDot2 = document.createElementNS(svgns, "circle");
gsap.set(oriDot2, {
    attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
});
let oriDot3 = document.createElementNS(svgns, "circle");
gsap.set(oriDot3, {
    attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
});
let clockDot1 = document.createElementNS(svgns, "circle");
gsap.set(clockDot1, {
    attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
});
let clockDot2 = document.createElementNS(svgns, "circle");
gsap.set(clockDot2, {
    attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
});
let clockDot3 = document.createElementNS(svgns, "circle");
gsap.set(clockDot3, {
    attr: { cx: 20, cy: 550, r: 15, fill: "#FF0000" }
});

svg.appendChild(oriDot1);
svg.appendChild(oriDot2);
svg.appendChild(oriDot3);
svg.appendChild(clockDot1);
svg.appendChild(clockDot2);
svg.appendChild(clockDot3);
function myFunction() {
    OBSERV.innerHTML = "";
}

function serialDotDisappear() {
    TweenLite.to(oriDot1, 0, { autoAlpha: 0 });
    TweenLite.to(oriDot2, 0, { autoAlpha: 0 });
    TweenLite.to(oriDot3, 0, { autoAlpha: 0 });

}
function clockDotDisappear() {
    TweenLite.to(clockDot1, 0, { autoAlpha: 0 });
    TweenLite.to(clockDot2, 0, { autoAlpha: 0 });
    TweenLite.to(clockDot3, 0, { autoAlpha: 0 });
}
function serialDotVisible() {
    TweenLite.to(oriDot1, 0, { autoAlpha: 1 });
    TweenLite.to(oriDot2, 0, { autoAlpha: 1 });
    TweenLite.to(oriDot3, 0, { autoAlpha: 1 });

}
function clockDotVisible() {
    TweenLite.to(clockDot1, 0, { autoAlpha: 1 });
    TweenLite.to(clockDot2, 0, { autoAlpha: 1 });
    TweenLite.to(clockDot3, 0, { autoAlpha: 1 });
}
function outputDisappear() {
    TweenLite.to(textO1, 0, { autoAlpha: 0 });
    TweenLite.to(textO2, 0, { autoAlpha: 0 });
    TweenLite.to(textO3, 0, { autoAlpha: 0 });

}
function outputVisible() {
    TweenLite.to(textO1, 0, { autoAlpha: 1 });
    TweenLite.to(textO2, 0, { autoAlpha: 1 });
    TweenLite.to(textO3, 0, { autoAlpha: 1 });

}
function serialDisappear1() {
    TweenLite.to(textI1, 0, { autoAlpha: 0 });
}
function clockDisappear() {
    TweenLite.to(textClock, 0, { autoAlpha: 0 });
}
function free() {
    OBSERV.innerHTML = "";
}
function serialVisible1() {
    TweenLite.to(textI1, 0, { autoAlpha: 1 });
}
function clockVisible() {
    TweenLite.to(textClock, 0, { autoAlpha: 1 });
}

function allDisappear() {
    serialDisappear1();
    serialDotDisappear();
    clockDisappear();
    clockDotDisappear();
    outputDisappear();
    gsap.set(I1, {
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
function outputDot() {
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
function outputHandlerSetter() {
    textO1.textContent = 1;
    textO2.textContent = 0;
    textO3.textContent = 0;

}
let temp = 0;
function outputHandler() {
    temp = textO3.textContent;
    textO3.textContent = textO2.textContent;
    textO2.textContent = textO1.textContent;
    textO1.textContent = temp;
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
function appendOri() {
    if (textI1.textContent != 0 && tl.progress() == 0) {
        serialDisappear1();
        textI1.textContent = 0;
        svg.appendChild(textI1);
        gsap.set(textI1, {
            x: 17,
            y: 554
        });
        gsap.set(I1, {
            fill: "#eeeb22"
        });
        free();
        serialVisible1();
        errno();
        setter(textI1.textContent, oriDot1);
        setter(textI1.textContent, oriDot2);
        setter(textI1.textContent, oriDot3);
        OBSERV.innerHTML = "ori is set to 0";
    }
    else if (textI1.textContent != 1 && tl.progress() == 0) {
        appendI1To1();
    }



}
function appendI1To1() {
    serialDisappear1();
    textI1.textContent = 1;
    svg.appendChild(textI1);
    gsap.set(textI1, {
        x: 17,
        y: 554
    });
    gsap.set(I1, {
        fill: "#29e"
    });
    free();
    serialVisible1();
    errno();
    setter(textI1.textContent, oriDot1);
    setter(textI1.textContent, oriDot2);
    setter(textI1.textContent, oriDot3);
    OBSERV.innerHTML = "ori is set to 1";
}
function appendClock() {
    if (textClock.textContent != 0 && tl.progress() == 0) {
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
    errno();
    OBSERV.innerHTML = "Clock has Started";
}



function reboot() {
    textI1.textContent = 2;
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
function errno() {
}
function batado() {
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
let tl = gsap.timeline({ repeat: 0, repeatDelay: 0 });
function clockto0() {
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
function clockto1() {
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
    if (textClock.textContent != 2 && textI1.textContent != 2 && tl.progress() != 1) {
        tl.resume();
        tl.timeScale(4);
        OBSERV.innerHTML = "4x speed";
        decide = 1;
        BUTTON.innerHTML = "Pause";
    }
}
function oneXspeed() {
    if (textClock.textContent != 2 && textI1.textContent != 2 && tl.progress() != 1) {
        tl.resume();
        tl.timeScale(1);
        OBSERV.innerHTML = "1x speed";
        decide = 1;
        BUTTON.innerHTML = "Pause";
    }
}
function doubleSpeed() {
    if (textClock.textContent != 2 && textI1.textContent != 2 && tl.progress() != 1) {
        tl.resume();
        tl.timeScale(2);
        OBSERV.innerHTML = "2x speed";
        decide = 1;
        BUTTON.innerHTML = "Pause";
    }
}
function SetSpeed(speed) {
    if (circuitStarted!=0) {
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
const SPEED = document.getElementById("speed");
function restartCircuit() {
    if (circuitStarted == 1) {
        circuitStarted = 0;
    }
    tl.seek(0);
    tl.pause();
    allDisappear();
    reboot();
    myFunction();
    decide = 0;
    BUTTON.innerHTML = "Start";
    OBSERV.innerHTML = "Successfully restored";
    SPEED.selectedIndex = 0;
}
let decide = 0;
let circuitStarted = 0;
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
        SPEED.selectedIndex = 0;
    }
    else if (tl.progress() == 1) {
        OBSERV.innerHTML = "Please Restart the simulation";
    }
}
function startCircuit() {
    if (textI1.textContent != 0 && textClock.textContent != 0) {
        OBSERV.innerHTML = "ori and clock must be set to 0.";
    }
    else if (textI1.textContent == 0 && textClock.textContent == 0 && textI1.textContent != 2 && tl.progress() != 1) {
        if (circuitStarted == 0) {
            circuitStarted = 1;
        }
        tl.play();
        tl.timeScale(1);
        OBSERV.innerHTML = "Simulation has started.";
        decide = 1;
        BUTTON.innerHTML = "Pause";
        SPEED.selectedIndex = 0;
    }
    else if (textI1.textContent == 2 || textClock.textcontent == 2) {
        OBSERV.innerHTML = "Please select the values";
    }
    else if (textClock.textContent != 0 && tl.progress() == 0) {
        OBSERV.innerHTML = "Please set the clock to 0.";
    }

    else if (tl.progress() == 1) {
        OBSERV.innerHTML = "Please Restart the simulation";
    }
}
tl.add(serialDotVisible, 0);
tl.add(serialDotDisappear, 7);
tl.add(outputHandlerSetter, 7);
tl.add(outputSetter, 7);
tl.add(outputVisible, 7);
tl.add(appendI1To1,8);
tl.add(clockto1, 8);
tl.add(clockto0, 15);
tl.add(clockDotVisible, 15);
tl.add(clockDotDisappear, 20);
tl.add(outputHandler, 21);
tl.add(outputSetter, 21);
tl.add(outputVisible, 21);
tl.add(clockto1, 22);
tl.add(clockto0, 29);
tl.add(clockDotVisible, 29);
tl.add(clockDotDisappear, 34);
tl.add(outputHandler, 33);
tl.add(outputSetter, 34);
tl.add(outputVisible, 34);
tl.add(batado, 34);
tl.eventCallback("onComplete", outputVisible);
tl.eventCallback("onComplete", batado);

tl.to(oriDot1, {
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
tl.to(oriDot2, {
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


tl.to(oriDot3, {
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
tl.to(clockDot1, {
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
tl.to(clockDot2, {
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
tl.to(clockDot3, {
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
tl.to(clockDot1, {
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
tl.to(clockDot2, {
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
tl.to(clockDot3, {
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

tl.pause();
serialDotDisappear();
serialDotDisappear();
clockDotDisappear();
