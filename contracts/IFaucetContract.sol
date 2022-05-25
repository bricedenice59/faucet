// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//they cannot inherit from other smart contracts, only from other interfaces
//no constructor
//no state variable
//all signatures must have the external keyword

interface IFaucet {
    function addFunds() external payable;

    function withdraw(uint256 amount) external;
}
