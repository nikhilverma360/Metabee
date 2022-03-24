//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TheGame is IERC721Receiver, Ownable {
    struct Mines {
        string name;
        uint256 lucky;
        uint256 staminaRequired;
        uint256 rewardLowerLimit;
        uint256 rewardUpperLimit;
    }
    mapping(uint256 => Mines) public _mines;

    struct MinerLog {
        bool gameJoined;
        bool staked;
        uint256 minerId;
        uint256 mineId;
        uint256 timestamp;
        uint256 reward;
        uint256 stamina;
    }
    mapping(address => MinerLog) public _minerlog;

    IERC20 public gameToken;
    IERC721 public gameNFT;

    //constructor
    constructor(address _gameTokenAddress, address _gameNFTAddress) {
        gameToken = IERC20(_gameTokenAddress);
        gameNFT = IERC721(_gameNFTAddress);
    }

    //internal
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    //users

    function joinGame() public {
        require(_minerlog[msg.sender].gameJoined != true, "You already Joined");
        _minerlog[msg.sender] = MinerLog(true, false, 0, 0, 0, 0, 100);
    }

    function startMining(uint256 _minerId, uint256 _mineId) public {
        require(_minerlog[msg.sender].gameJoined, "join the game first");
        require(
            block.timestamp - _minerlog[msg.sender].timestamp > 1 minutes,
            "wait for your time"
        );
        require(_minerlog[msg.sender].staked != true, "you are already mining");
        require(
            gameNFT.ownerOf(_minerId) == msg.sender,
            "you are not owner of the NFT"
        );

        require(
            _minerlog[msg.sender].stamina >= _mines[_mineId].staminaRequired,
            "you don't have enough stamina"
        );

        _minerlog[msg.sender].minerId = _minerId;
        _minerlog[msg.sender].mineId = _mineId;
        _minerlog[msg.sender].timestamp = block.timestamp;

        _minerlog[msg.sender].stamina =
            _minerlog[msg.sender].stamina -
            _mines[_mineId].staminaRequired;

        //luckey implementation.......
        //add chain link vrf....
        // . .. to doo...
        // check contract have rewards in pool?

        gameNFT.safeTransferFrom(msg.sender, address(this), _minerId);
        _minerlog[msg.sender].staked = true;
        //need to fix reward with chainkink VRF
        _minerlog[msg.sender].reward = _minerlog[msg.sender].reward + 4 ether;
    }

    function redeemReward() public payable {
        require(_minerlog[msg.sender].staked, "You havn't staked");
        require(
            block.timestamp - _minerlog[msg.sender].timestamp > 1 minutes,
            "wait for your time"
        );

        gameNFT.safeTransferFrom(
            address(this),
            msg.sender,
            _minerlog[msg.sender].minerId
        );
        _minerlog[msg.sender].staked = false;

        gameToken.transfer(msg.sender, _minerlog[msg.sender].reward);
        _minerlog[msg.sender].reward = 0;
    }

    function increaseStamina(uint256 _amount) public payable {
        gameToken.transferFrom(msg.sender, address(this), _amount);
        _minerlog[msg.sender].stamina =
            _minerlog[msg.sender].stamina +
            (_amount / 1 ether);
    }

    //only owner
    function setMines(
        uint256 _id,
        string memory _name,
        uint256 _lucky,
        uint256 _staminaRequired,
        uint256 _rewardLowerLimit,
        uint256 _rewardUpperLimit
    ) public onlyOwner {
        _mines[_id] = Mines(
            _name,
            _lucky,
            _staminaRequired,
            _rewardLowerLimit,
            _rewardUpperLimit
        );
    }

    function withdrawETH() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }

    function withdrawERC20() public payable onlyOwner {
        gameToken.transfer(msg.sender, gameToken.balanceOf(address(this)));
    }
}
