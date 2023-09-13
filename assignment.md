1. Design a 4 bit Synchronous UP counter using 4 JK flip flops, a common clock pulse, and basic gates.

2. Design a synchromous BCD counter which counts from 0000 (0) to 1001 (9) and then back to 0000 (0).You can use 'T' flip flops / Jk flip flops and some basic gates in the design. All the flip flops should have a common clock pulse. There must be a 'Count Enable' input which enables the counter. Save this counter so that it can be used in other designs.

3. Import the BCD counter designed in 2nd question. Import 3 such counters. Design a 3-decade decimal counter using these 3 BCD counters. The entire system should be able to count from 000 to 999, where each counter individually generates 1 digit of the number.

HINT: The 'Count enable' input of 2nd BCD counter will be 1 only when first counter is at 9, and 'Count enable' of 3rd counter will be 1 only when both first and second counters are at 9.
