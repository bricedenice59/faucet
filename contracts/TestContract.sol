// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Test {
    function test(uint256 testNumber) external pure returns (uint256 data) {
        assembly {
            mstore(0x40, 0x90)
        }

        uint8[3] memory items = [1, 2, 3];

        assembly {
            data := mload(0x90)
        }
    }

    function test1() external pure returns (uint256 data) {
        assembly {
            let str := mload(0x40)
            mstore(add(str, 0x00), 0x6272696365)
            data := mload(add(str, 0x00))
        }
    }
}
