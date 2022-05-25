// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Owned {
    address public _owner;

    constructor() {
        _owner = msg.sender;
    }

    modifier checkOwner() {
        require(_owner == msg.sender, "only owner can call this function");
        _;
    }
}
