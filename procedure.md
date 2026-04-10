### 2-bit Asynchronous Binary Counter

#### Components Required

- 2 J-K flip-flops

#### Circuit Connections

1. Drag the first J-K flip-flop and connect its J, K and clk input points to J, K and Clock inputs respectively.
2. Drag the second J-K flip-flop and connect its J and K input points to J and K inputs.
3. Connect the clk input of second flip-flop to Q output of first flip-flop.
4. Connect Q output of first flip-flop to QA output bit and Q output of second flip-flop to QB output bit.
5. Set J and K to 1 and Clock to 0. Click on "Simulate".

#### Observations

- The output bits change in binary sequence: 00 → 01 → 10 → 11 → 00 and so on whenever the clock gets negative edge triggered.
- This creates a 2-bit binary counting sequence with QA as LSB and QB as MSB.
- The counter demonstrates ripple carry effect where changes propagate from LSB to MSB.
- If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".

### 3-bit Asynchronous Ring Counter

#### Components Required

- 3 D flip-flops

#### Circuit Connections

1. Drag 3 D flip-flops, place one of them near the QA output bit, one near QB output bit and the third one near QC output bit.
2. Connect the ORI input bit to PR (Preset) of the first (uppermost) flip-flop and also to CLR (Clear) of the other 2 flip-flops.
3. Connect the Clock input bit to clk of all the 3 flip-flops.
4. Connect the D input of first flip-flop to the Q output of third (lowermost) flip-flop, D input of second flip-flop to Q output of first flip-flop and D input of third flip-flop to Q output of second flip-flop.
5. Connect Q output of first flip-flop to QA output bit, Q output of second flip-flop to QB output bit and Q output of third flip-flop to QC output bit.
6. Set ORI and Clock to 0 and click on "Simulate".

#### Observations

- Initially the output bits are QA=1, QB=0 and QC=0 after proper initialization with ORI input.
- When the clock gets negative edge triggered the output bits change in sequence: QA=1,QB=0,QC=0 → QA=0,QB=1,QC=0 → QA=0,QB=0,QC=1 → QA=1,QB=0,QC=0 and so on.
- Only one output is HIGH at any given time, creating a circular shifting pattern.
- The ring counter demonstrates one-hot encoding sequence generation.
- If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".

### 4-bit Synchronous Binary Counter

#### Components Required

- 4 J-K flip-flops
- 3 AND gates (for toggle control logic)

#### Circuit Connections

1. Drag the first J-K flip-flop and connect its J₀, K₀ inputs to logic HIGH (1) and clk input to Clock input bit. Connect its Q₀ output to Q₀ output bit.
2. Drag the second J-K flip-flop and connect its J₁, K₁ inputs to Q₀ output of first flip-flop and clk input to Clock input bit. Connect its Q₁ output to Q₁ output bit.
3. Drag the third J-K flip-flop. Use an AND gate to connect Q₀ and Q₁ outputs to its J₂, K₂ inputs and clk input to Clock input bit. Connect its Q₂ output to Q₂ output bit.
4. Drag the fourth J-K flip-flop. Use an AND gate with three inputs to connect Q₀, Q₁ and Q₂ outputs to its J₃, K₃ inputs and clk input to Clock input bit. Connect its Q₃ output to Q₃ output bit.
5. Connect Reset input to CLR (Clear) inputs of all flip-flops for initialization.
6. Click on "Simulate" and observe the synchronous counting behavior.

#### Observations

- All flip-flops change state simultaneously on each clock edge, eliminating propagation delays.
- The output follows binary counting sequence: 0000 → 0001 → 0010 → 0011 → ... → 1111 → 0000.
- Higher operating frequency capability compared to asynchronous counters.
- The counter demonstrates synchronous operation with parallel state changes.
- If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".

### Frequency Divider Circuit

#### Components Required

- 3 J-K flip-flops (for divide-by-8 frequency divider)

#### Circuit Connections

1. Drag the first J-K flip-flop and connect its J₀, K₀ inputs to logic HIGH (1) and clk input to Input Clock signal. Connect its Q₀ output to ÷2 output bit.
2. Drag the second J-K flip-flop and connect its J₁, K₁ inputs to logic HIGH (1) and clk input to Q₀ output of first flip-flop. Connect its Q₁ output to ÷4 output bit.
3. Drag the third J-K flip-flop and connect its J₂, K₂ inputs to logic HIGH (1) and clk input to Q₁ output of second flip-flop. Connect its Q₂ output to ÷8 output bit.
4. Apply a continuous clock signal to the Input Clock and observe the frequency division at each output.
5. Click on "Simulate" and observe the frequency division behavior.

#### Observations

- The first flip-flop (Q₀) provides frequency division by 2 (÷2 output).
- The second flip-flop (Q₁) provides frequency division by 4 (÷4 output).
- The third flip-flop (Q₂) provides frequency division by 8 (÷8 output).
- Each stage divides the frequency by 2, creating binary frequency relationships.
- The frequency divider demonstrates practical application of counters in clock generation circuits.
- If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".
