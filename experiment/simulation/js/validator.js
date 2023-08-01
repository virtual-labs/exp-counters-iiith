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


// Basic Counter Tester
export function testBasicCounter(inputJ, inputK, inputClk, outputQB, outputQA)  // This function takes 4 ids of the respective Gates
{
    let gates_list = gates;
    let flipflops_list = flipFlops;
    let j = gates_list[inputJ];
    let k = gates_list[inputK];
    let clk = gates_list[inputClk];
    let circuitIsCorrect = true;
    let init_j = j.output;
    let init_k = k.output;
    let init_Clk = clk.output;


    let qa = gates_list[outputQA];
    let qb = gates_list[outputQB];

    let init_qa = qa.output;
    let init_qb = qb.output;

    // each list element consists of 2 values QB,QA
    // there are 4 unique states that are going to occur in a fixed order
    // we first simulate and find the current states
    // simulate further 7 times to check if the order matches or not
    const expectedOutputs = [[false, false], [false, true], [true, false], [true, true],[false, false], [false, true], [true, false], [true, true]];
    j.setOutput(true);
    k.setOutput(true);
    clk.setOutput(false);
    if (testSimulation(gates_list, flipflops_list)) {
        clk.setOutput(true);
        testSimulation(gates_list, flipflops_list);
        clk.setOutput(false);
        testSimulation(gates_list, flipflops_list);
        let firstOutput = -1;
        for (let i = 0; i < 4; i++) {
            if (qa.output == expectedOutputs[i][1] && qb.output == expectedOutputs[i][0]) {
                firstOutput = i;
                break;
            }
        }
        if (firstOutput == -1) {
            circuitIsCorrect = false;
        }
        else {
            for (let i = 1; i < 8; i++) {
                clk.setOutput(true);
                testSimulation(gates_list, flipflops_list);
                clk.setOutput(false);
                testSimulation(gates_list, flipflops_list);
                // check if output is correct
                if ((qb.output !== expectedOutputs[(i + firstOutput) % 8][0] || qa.output !== expectedOutputs[(i + firstOutput) % 8][1])) {
                    circuitIsCorrect = false;
                }
            }
        }
        const result = document.getElementById('result');

        if (circuitIsCorrect) {
            result.innerHTML = "<span>&#10003;</span> Success";
            result.className = "success-message";
        }
        else {
            result.innerHTML = "<span>&#10007;</span> Fail";
            result.className = "failure-message";
        }
        j.setOutput(init_j);
        k.setOutput(init_k);
        clk.setOutput(init_Clk);
        qa.setOutput(init_qa);
        qb.setOutput(init_qb);
    }
}


// Ring Counter Flip FLop Tester
export function testRingCounter(inputOri, inputClk, outputA, outputB, outputC)  // This function takes 4 ids of the respective Gates
{
    let gates_list = gates;
    let flipflops_list = flipFlops;
    let ori = gates_list[inputOri];
    let clk = gates_list[inputClk];
    let outputa = gates_list[outputA];
    let outputb = gates_list[outputB];
    let outputc = gates_list[outputC];
    let circuitIsCorrect = true;

    let init_ori = ori.output;
    let init_Clk = clk.output;
    let init_a = outputa.output;
    let init_b = outputb.output;
    let init_c = outputc.output;
    
    clk.setOutput(false);
    // each list element consists of e values QC,QB,QA
    // there are 3 unique states that are going to occur in a fixed order
    // we first simulate and find the current states
    // simulate further 5 times to check if the order matches or not
    
    const expectedOutputs = [[false, true, false], [true, false, false], [false, false, true],[false, true, false], [true, false, false], [false, false, true]]
    if (testSimulation(gates_list, flipflops_list)) {
        ori.setOutput(true);
        clk.setOutput(true);
        testSimulation(gates_list, flipflops_list);
        clk.setOutput(false);
        testSimulation(gates_list, flipflops_list);
        let firstOutput = -1;
        for (let i = 0; i < 3; i++) {
            if (outputc.output == expectedOutputs[i][0] && outputb.output == expectedOutputs[i][1] && outputa.output == expectedOutputs[i][2]) {
                firstOutput = i;
                break;
            }
        }
        if (firstOutput == -1) {
            circuitIsCorrect = false;
        }
        else {
            for (let i = 1; i < 6; i++) {
                clk.setOutput(true);
                testSimulation(gates_list, flipflops_list);
                clk.setOutput(false);
                testSimulation(gates_list, flipflops_list);
                // check if output is correct
                if ((outputc.output !== expectedOutputs[(i + firstOutput) % 6][0] || outputb.output !== expectedOutputs[(i + firstOutput) % 6][1] || outputa.output !== expectedOutputs[(i + firstOutput) % 6][2])) {
                    circuitIsCorrect = false;
                }
            }
        }
        const result = document.getElementById('result');

        if (circuitIsCorrect) {
            result.innerHTML = "<span>&#10003;</span> Success";
            result.className = "success-message";
        }
        else {
            result.innerHTML = "<span>&#10007;</span> Fail";
            result.className = "failure-message";
        }
    }
    ori.setOutput(init_ori);
    clk.setOutput(init_Clk);
    outputa.setOutput(init_a);
    outputb.setOutput(init_b);
    outputc.setOutput(init_c);
}
