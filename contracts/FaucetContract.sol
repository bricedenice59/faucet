// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./OwnedContract.sol";

contract Faucet is Owned {
    uint256 public numOfFunders;
    mapping(address => bool) private funders;
    mapping(uint256 => address) private lookupFunders;

    modifier limitWithdraw(uint256 amount) {
        require(
            amount <= 1000000000000000000,
            "not enough fund..., max 1 eth!"
        );
        _;
    }

    receive() external payable {}

    function addFunds() external payable {
        address funder = msg.sender;

        if (!funders[funder]) {
            uint256 index = numOfFunders++;
            funders[funder] = true;
            lookupFunders[index] = funder;
        }
    }

    function withdraw(uint256 amount) external limitWithdraw(amount) {
        payable(msg.sender).transfer(amount);
    }

    function justTestingView() external view {
        // it indicates that this function will not alter the storage state in any way
    }

    function justTestingPure() external pure returns (uint256) {
        // it indicates that this function will not even read the storage state
        return 2 + 2;
    }

    function getFunderAtIndex(uint256 index) external view returns (address) {
        return lookupFunders[index];
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);
        for (uint256 index = 0; index < numOfFunders; index++) {
            _funders[index] = lookupFunders[index];
        }
        return _funders;
    }

    function testAdmin() external checkOwner {
        //admin is the user who deployed the contract, so only him can interact with this fct
    }

    function transferOwnershipTo(address newOwner) external checkOwner {
        _owner = newOwner;
    }

    //sudo truffle migrate --reset
    //sudo truffle console
    //const inst = await Faucet.deployed()
    //inst.addFunds({from: accounts[2], value:1000000000000000000})
    //inst.getAllFunders()

    //pure and view => No gas fee
}
