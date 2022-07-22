# Two Bit Asynchronous Basic Binary Counter

## Components Required - 

* 2 J-K flip flops

## Circuit Connections - 

* Drag the first J-K flip flop and connect its J,K and clk input points to J, K and Clock inputs respectively.
* Drag the second J-K flip flop and connect its J and K input points to J and K inputs.
* Connect the clk input of second flip flop to Q of first flip flop.
* Connect Q of first flip flop to QA output bit and Q of second flip flop to QB output bit.
* Set J and K to 1 and Clock to 0. Click on "Simulate".

## Observations - 

* The output bits change from 11 -> 00 -> 01 -> 10 -> 11 and so on whenever the clock gets negative edge triggered.
* If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".

# Three Bit Asynchronous Ring Counter

## Components Required - 

* 3 D flip-flops

## Circuit Connections - 

* Drag 3 D flip-flops, place one of them near the QA output bit, one near QB output bit and the third one near QC output bit.
* Connect the ORI input bit to PR of the first (uppermost) flip-flop and also to CLR of the other 2 flip-flops.
* Connect the Clock input bit to clk of all the 3 flip-flops.
* Connect the D of first flip-flop to the Q of third (lowermost) flip-flop, D of second flip-flop to Q of first flip-flop and D of third flip-flop to Q of second flip-flop.
* Set ORI and Clock to 0 and click on "Simulate".

## Observations - 

* Initially the output bits are QA=1,QB=0 and QC=0. When the clock gets negative edge triggered the output bits change to QA=0,QB=1 and QC=1 then to QA=0,QB=0 and QC=1 and then again to QA=1,QB=0 and QC=0 and so on.
* If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".
