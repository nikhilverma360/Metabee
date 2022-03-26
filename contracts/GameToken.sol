// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameToken is ERC20, Ownable {
    constructor() ERC20("Game", "token") {
        _mint(msg.sender, 10000 ether);
    }

    function faucet() public {
        _mint(msg.sender, 10000 ether);
    }

    function mintTo(address _to) public {
        _mint(_to, 10000 ether);
    }
}
