1. Design a 4-bit synchronous UP counter using 4 JK flip-flops, a common clock pulse, and basic logic gates. The counter should increment from 0000 to 1111 and then reset to 0000. For circuit diagram reference, refer to the theory section.

2. Construct a synchronous BCD counter which counts from 0000 (0) to 1001 (9) and then resets back to 0000 (0). You can use T flip-flops or JK flip-flops along with basic logic gates in the design. All flip-flops should have a common clock pulse. Include a 'Count Enable' input which enables the counter operation. Save this counter design as it will be used in subsequent assignments.

3. Design a 3-decade decimal counter using three BCD counters from assignment 2. Import the saved BCD counter design three times to create this system. The complete counter should count from 000 to 999, where each BCD counter generates one digit of the three-digit decimal number.

4. Can a synchronous counter be converted to an asynchronous counter by simply removing the common clock connection? If yes, explain the process. If no, explain why not and what additional changes would be required.

**Note for Assignment 3:** The 'Count Enable' input of the second BCD counter should be HIGH (1) only when the first counter reaches 9, and the 'Count Enable' input of the third counter should be HIGH (1) only when both the first and second counters are at 9 simultaneously.
