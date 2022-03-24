//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Game is ERC721Enumerable, IERC721Receiver, Ownable {
    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.05 ether;
    uint256 public presaleCost = 0.03 ether;
    uint256 public maxSupply = 50000;
    uint256 public maxMintAmount = 5;
    bool public paused = false;
    mapping(address => bool) public whitelisted;
    mapping(address => bool) public presaleWallets;

    struct AxeMeta {
        uint256 level;
        uint256 durability;
    }
    mapping(uint256 => AxeMeta) public _axeMeta;

    struct Mines {
        string name;
        uint256 lucky;
        uint256 rewardLowerLimit;
        uint256 rewardUpperLimit;
    }
    mapping(uint256 => Mines) public _mines;

    struct MinerLog {
        bool staked;
        uint256 minerId;
        uint256 mineId;
        uint256 timestamp;
        uint256 reward;
    }
    mapping(address => MinerLog) public _minerlog;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // public
    function mint(address _to, uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(!paused);
        require(_mintAmount > 0);
        require(_mintAmount <= maxMintAmount);
        require(supply + _mintAmount <= maxSupply);

        //custom token implementation....
        // .............to do ..............

        if (msg.sender != owner()) {
            if (whitelisted[msg.sender] != true) {
                if (presaleWallets[msg.sender] != true) {
                    //general public
                    require(msg.value >= cost * _mintAmount);
                } else {
                    //presale
                    require(msg.value >= presaleCost * _mintAmount);
                }
            }
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(_to, supply + i);

            // level implementation
            //add chain link vrf....
            //.........to do.........

            _axeMeta[supply + i] = AxeMeta(2, 60);
        }
    }

    function startMining(uint256 _minerId, uint256 _mineId) public {
        require(block.timestamp - _minerlog[msg.sender].timestamp > 1 minutes);
        require(_minerlog[msg.sender].staked != true);
        require(ownerOf(_minerId) == msg.sender);
        _minerlog[msg.sender].minerId = _minerId;
        _minerlog[msg.sender].mineId = _mineId;
        _minerlog[msg.sender].timestamp = block.timestamp;
        // durebility to be set
        _axeMeta[_minerId].durability = _axeMeta[_minerId].durability - 4;

        //luckey implementation.......
        //add chain link vrf....
        // . .. to doo...
        // check contract have rewards in pool?

        safeTransferFrom(msg.sender, address(this), _minerId);
        _minerlog[msg.sender].staked = true;
        _minerlog[msg.sender].reward = _minerlog[msg.sender].reward + 4;
    }

    function redeemReward() public {
        require(_minerlog[msg.sender].staked);
        // time stamp to be implemented
        safeTransferFrom(
            address(this),
            msg.sender,
            _minerlog[msg.sender].minerId
        );
        // send tokens....
        // to be inplemented.....

        _minerlog[msg.sender].reward = 0;
    }

    function fixDurability() public {
        // fixing durability
        // 1 erc20 is 1 durability fix
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    //only owner
    function setMines(
        uint256 _id,
        string memory _name,
        uint256 _lucky,
        uint256 _rewardLowerLimit,
        uint256 _rewardUpperLimit
    ) public onlyOwner {
        _mines[_id] = Mines(
            _name,
            _lucky,
            _rewardLowerLimit,
            _rewardUpperLimit
        );
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setPresaleCost(uint256 _newCost) public onlyOwner {
        presaleCost = _newCost;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function whitelistUser(address _user) public onlyOwner {
        whitelisted[_user] = true;
    }

    function removeWhitelistUser(address _user) public onlyOwner {
        whitelisted[_user] = false;
    }

    function addPresaleUser(address _user) public onlyOwner {
        presaleWallets[_user] = true;
    }

    function add100PresaleUsers(address[100] memory _users) public onlyOwner {
        for (uint256 i = 0; i < 2; i++) {
            presaleWallets[_users[i]] = true;
        }
    }

    function removePresaleUser(address _user) public onlyOwner {
        presaleWallets[_user] = false;
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}
