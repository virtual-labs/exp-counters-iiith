import { gates, testSimulation } from './gate.js';
import { flipFlops } from './flipflop.js';

'use strict';

// Helper functions
export function computeXor(a, b) {
    return a != b;
}
export function computeAnd(a, b) {
    return a && b;
}
export function computeOr(a, b) {
    return a || b;
}
export function computeXnor(a, b) {
    return a == b;
}
export function computeNand(a, b) {
    return !(a && b);
}
export function computeNor(a, b) {
    return !(a || b);
}

// The tests below change the values of the input bits, the clock and the flip-flops while they run.
// This remembers everything they change, so that the circuit board is as the student left it afterwards.
function saveState() {
    const state = { bits: [], flipFlops: [] };
    for (const id in gates) {
        const gate = gates[id];
        if (gate.isInput || gate.isOutput) {
            state.bits.push([gate, gate.output]);
        }
    }
    for (const id in flipFlops) {
        const ff = flipFlops[id];
        state.flipFlops.push([ff, ff.q, ff.qbar, ff.prevclk, ff.dbefore]);
    }
    return state;
}

function restoreState(state) {
    state.bits.forEach(([gate, output]) => gate.setOutput(output));
    state.flipFlops.forEach(([ff, q, qbar, prevclk, dbefore]) => {
        ff.q = q;
        ff.qbar = qbar;
        ff.prevclk = prevclk;
        ff.dbefore = dbefore;
    });
}

// Every test starts from the state in which the flip-flops are when a simulation starts: Q = 1, Q' = 0
function presetFlipFlops() {
    for (const id in flipFlops) {
        const ff = flipFlops[id];
        ff.q = true;
        ff.qbar = false;
        ff.prevclk = false;
        ff.dbefore = false;
    }
}

// One clock pulse: the clock goes to 1 and back to 0. The flip-flops change at the falling edge.
// Returns false if the circuit is not connected properly (the error is already shown on the screen).
function clockPulse(clk) {
    clk.setOutput(true);
    if (!testSimulation(gates, flipFlops)) {
        return false;
    }
    clk.setOutput(false);
    return testSimulation(gates, flipFlops);
}

function showResult(head, rows, circuitIsCorrect, successMessage, failMessage) {
    document.getElementById('table-head').innerHTML = head;
    document.getElementById('table-body').innerHTML = rows;
    const result = document.getElementById('result');
    if (circuitIsCorrect) {
        result.innerHTML = "<span>&#10003;</span> " + successMessage;
        result.className = "success-message";
    }
    else {
        result.innerHTML = "<span>&#10007;</span> " + failMessage;
        result.className = "failure-message";
    }
}

const bit = (value) => (value ? 1 : 0);

// Basic Counter Tester: a 2-bit binary counter made of two J-K flip-flops
export function testBasicCounter(inputJ, inputK, inputClk, outputQB, outputQA)  // This function takes the ids of the respective Gates
{
    const j = gates[inputJ];
    const k = gates[inputK];
    const clk = gates[inputClk];
    const qa = gates[outputQA];
    const qb = gates[outputQB];
    const saved = saveState();

    // the counter starts in the state QB QA = 11, so the first pulse gives 00
    // each list element consists of 2 values QB,QA
    const expectedOutputs = [[1, 1], [0, 0], [0, 1], [1, 0], [1, 1], [0, 0], [0, 1], [1, 0], [1, 1]];
    let circuitIsCorrect = true;
    let rows = "";
    let connected = true;

    presetFlipFlops();
    j.setOutput(true);
    k.setOutput(true);
    clk.setOutput(false);
    connected = testSimulation(gates, flipFlops);
    for (let pulse = 0; connected && pulse < expectedOutputs.length; pulse++) {
        if (pulse > 0) {
            connected = clockPulse(clk);
            if (!connected) {
                break;
            }
        }
        const observed = [bit(qb.output), bit(qa.output)];
        const expected = expectedOutputs[pulse];
        const okB = observed[0] === expected[0];
        const okA = observed[1] === expected[1];
        if (!okB || !okA) {
            circuitIsCorrect = false;
        }
        rows += `<tr class="bold-table"><th>${pulse}</th><td>${expected[0]}</td><td>${expected[1]}</td>` +
            `<td class="${okB ? "success-table" : "failure-table"}">${observed[0]}</td>` +
            `<td class="${okA ? "success-table" : "failure-table"}">${observed[1]}</td></tr>`;
    }
    restoreState(saved);
    if (!connected) {
        return;
    }
    const head = `<tr><th rowspan="2">Clock pulses</th><th colspan="2">Expected</th><th colspan="2">Observed</th></tr>` +
        `<tr><th>QB</th><th>QA</th><th>QB</th><th>QA</th></tr>`;
    showResult(head, rows, circuitIsCorrect,
        "Success - the circuit counts 00, 01, 10, 11 in binary",
        "Fail - the outputs do not follow the binary count");
}


// Ring Counter Flip FLop Tester
export function testRingCounter(inputOri, inputClk, outputA, outputB, outputC)  // This function takes the ids of the respective Gates
{
    const ori = gates[inputOri];
    const clk = gates[inputClk];
    const outputa = gates[outputA];
    const outputb = gates[outputB];
    const outputc = gates[outputC];
    const saved = saveState();

    // each list element consists of 3 values QA,QB,QC: the set bit moves from QA to QB to QC and back to QA
    const expectedOutputs = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]];
    let circuitIsCorrect = true;
    let rows = "";
    let connected = true;

    // Ori = 0 presets the first flip-flop and clears the other two, then Ori = 1 lets the counter run
    presetFlipFlops();
    clk.setOutput(false);
    ori.setOutput(false);
    connected = testSimulation(gates, flipFlops);
    if (connected) {
        ori.setOutput(true);
        connected = testSimulation(gates, flipFlops);
    }
    for (let pulse = 0; connected && pulse < expectedOutputs.length; pulse++) {
        if (pulse > 0) {
            connected = clockPulse(clk);
            if (!connected) {
                break;
            }
        }
        const observed = [bit(outputa.output), bit(outputb.output), bit(outputc.output)];
        const expected = expectedOutputs[pulse];
        const ok = observed.map((value, i) => value === expected[i]);
        if (ok.includes(false)) {
            circuitIsCorrect = false;
        }
        rows += `<tr class="bold-table"><th>${pulse}</th><td>${expected[0]}</td><td>${expected[1]}</td><td>${expected[2]}</td>` +
            observed.map((value, i) => `<td class="${ok[i] ? "success-table" : "failure-table"}">${value}</td>`).join("") + `</tr>`;
    }
    restoreState(saved);
    if (!connected) {
        return;
    }
    const head = `<tr><th rowspan="2">Clock pulses</th><th colspan="3">Expected</th><th colspan="3">Observed</th></tr>` +
        `<tr><th>QA</th><th>QB</th><th>QC</th><th>QA</th><th>QB</th><th>QC</th></tr>`;
    showResult(head, rows, circuitIsCorrect,
        "Success - the set bit moves from QA to QB to QC and back",
        "Fail - the set bit does not move from QA to QB to QC and back");
}

// Frequency Divider Tester: the output has to have a quarter of the frequency of the clock
export function testFreqDivider(inputJ, inputK, inputClk, output)  // This function takes the ids of the respective Gates
{
    const j = gates[inputJ];
    const k = gates[inputK];
    const clk = gates[inputClk];
    const out = gates[output];
    const saved = saveState();

    const pulses = 12;
    const samples = [];
    let connected = true;

    presetFlipFlops();
    j.setOutput(true);
    k.setOutput(true);
    clk.setOutput(false);
    connected = testSimulation(gates, flipFlops);
    for (let pulse = 1; connected && pulse <= pulses; pulse++) {
        connected = clockPulse(clk);
        if (connected) {
            samples.push(bit(out.output));
        }
    }
    restoreState(saved);
    if (!connected) {
        return;
    }

    // A signal with a quarter of the clock frequency is low for 2 clock pulses and high for 2 clock pulses,
    // whichever of the 4 phases it starts in. So every sample is the opposite of the one 2 pulses before it.
    let circuitIsCorrect = true;
    let rows = "";
    samples.forEach((value, i) => {
        const ok = i < 2 || value !== samples[i - 2];
        if (!ok) {
            circuitIsCorrect = false;
        }
        const note = i < 2 ? "-" : (ok ? "opposite of the output 2 pulses before" : "same as the output 2 pulses before");
        rows += `<tr class="bold-table"><th>${i + 1}</th><td class="${ok ? "success-table" : "failure-table"}">${value}</td><td>${note}</td></tr>`;
    });
    const head = `<tr><th>Clock pulse</th><th>Output</th><th>Expected</th></tr>`;
    showResult(head, rows, circuitIsCorrect,
        "Success - the output has 1/4 of the frequency of the clock",
        "Fail - the output does not have 1/4 of the frequency of the clock");
}
