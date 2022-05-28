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





// RS Flip FLop Tester
export function testRSFF(inputR, inputS, inputClk, outputQ, outputQbar)  // This function takes 4 ids of the respective Gates
{
    let gates_list = gates;

    let r = gates_list[inputR];
    let s = gates_list[inputS];
    let clk = gates_list[inputClk];
    let circuitIsCorrect = true;


    let q = gates_list[outputQ];
    let qbar = gates_list[outputQbar];
    q.setOutput(true);
    qbar.setOutput(false);

    // each list element consists of 5 values, R,S,Clk,Q,Qbar
    const evaluator = [[0, 0, 0, 1, 0], [0, 1, 0, 1, 0], [1, 0, 0, 1, 0], [1, 1, 0, 1, 0], [0, 1, 1, 0, 1], [0, 0, 1, 0, 1], [1, 0, 1, 1, 0]]

    evaluator.forEach(element => {
        r.setOutput(element[0] === 1);
        s.setOutput(element[1] === 1);
        clk.setOutput(element[2] === 1);
        testSimulation(gates_list);
        // check if output is correct
        if ((q.output != element[3] || qbar.output != element[4])) {
            circuitIsCorrect = false;
        }
    });

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

// JK Flip FLop Tester
export function testJKFF(inputJ, inputK, inputClk, outputQB, outputQA)  // This function takes 4 ids of the respective Gates
{
    let gates_list = gates;
    let flipflops_list = flipFlops;
    let j = gates_list[inputJ];
    let k = gates_list[inputK];
    let clk = gates_list[inputClk];
    let circuitIsCorrect = true;


    let qa = gates_list[outputQA];
    let qb = gates_list[outputQB];
    // each list element consists of 5 values, j,k,Clk,Q,Qbar
    const expectedOutputs = [[false, false], [false, true], [true, false], [true, true]];
    j.setOutput(true);
    k.setOutput(true);
    clk.setOutput(false);
    if (testSimulation(gates_list, flipflops_list)) {
        clk.setOutput(true);
        testSimulation(gates_list, flipflops_list);
        clk.setOutput(false);
        testSimulation(gates_list, flipflops_list);
        let first_output = -1;
        for (let i = 0; i < 4; i++) {
            if (qa.output == expectedOutputs[i][1] && qb.output == expectedOutputs[i][0]) {
                first_output = i;
                break;
            }
        };
        if (first_output == -1) {
            circuitIsCorrect = false;
        }
        else {
            for (let i = 1; i < 4; i++) {
                clk.setOutput(true);
                testSimulation(gates_list, flipflops_list);
                clk.setOutput(false);
                testSimulation(gates_list, flipflops_list);
                // check if output is correct
                if ((qb.output !== expectedOutputs[(i + first_output) % 4][0] || qa.output !== expectedOutputs[(i + first_output) % 4][1])) {
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
}


// D Flip FLop Tester
export function testDFF(inputOri, inputClk, outputA, outputB, outputC)  // This function takes 4 ids of the respective Gates
{
    let gates_list = gates;
    let flipflops_list = flipFlops;
    let ori = gates_list[inputOri];
    let clk = gates_list[inputClk];
    let outputa = gates_list[outputA];
    let outputb = gates_list[outputB];
    let outputc = gates_list[outputC];
    let circuitIsCorrect = true;
    //ori.setOutput(false);
    clk.setOutput(false);

    // each list element consists of 4 values, D,Clk,Q,Qbar
    const expectedOutputs = [[false, true, false], [true, false, false], [false, false, true]]
    if (testSimulation(gates_list, flipflops_list)) {
        ori.setOutput(true);
        clk.setOutput(true);
        testSimulation(gates_list, flipflops_list);
        clk.setOutput(false);
        testSimulation(gates_list, flipflops_list);
        let first_output = -1;
        for (let i = 0; i < 3; i++) {
            if (outputc.output == expectedOutputs[i][0] && outputb.output == expectedOutputs[i][1] && outputa.output == expectedOutputs[i][2]) {
                first_output = i;
                break;
            }
        };
        if (first_output == -1) {
            circuitIsCorrect = false;
        }
        else {
            for (let i = 1; i < 3; i++) {
                clk.setOutput(true);
                testSimulation(gates_list, flipflops_list);
                clk.setOutput(false);
                testSimulation(gates_list, flipflops_list);
                // check if output is correct
                if ((outputc.output !== expectedOutputs[(i + first_output) % 3][0] || outputb.output !== expectedOutputs[(i + first_output) % 3][1] || outputa.output !== expectedOutputs[(i + first_output) % 3][2])) {
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
}



// T Flip FLop Tester
export function testTFF(inputT, inputClk, outputQ, outputQbar)  // This function takes 4 ids of the respective Gates
{
    let gates_list = gates;
    let flipflops_list = flipFlops;

    let t = gates_list[inputT];
    let clk = gates_list[inputClk];
    let circuitIsCorrect = true;


    let q = gates_list[outputQ];
    let qbar = gates_list[outputQbar];
    q.setOutput(true);
    qbar.setOutput(false);
    // each list element consists of 4 values, T,Clk,Q,Qbar
    const evaluator = [[0, 0, 1, 0], [1, 0, 1, 0], [0, 1, 1, 0], [1, 1, 0, 1], [1, 1, 1, 0], [0, 1, 1, 0]]

    evaluator.forEach(element => {
        t.setOutput(element[0] === 1);
        clk.setOutput(element[1] === 1);
        testSimulation(gates_list, flipflops_list);

        // check if output is correct
        if ((q.output != element[2] || qbar.output != element[3]) && circuitIsCorrect) {
            circuitIsCorrect = false;
        }
    });

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