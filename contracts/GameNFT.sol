//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract GameNFT is ERC721Enumerable, VRFConsumerBase, Ownable {
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

    struct NFTMeta {
        uint256 level;
        uint256 lucky;
    }
    mapping(uint256 => NFTMeta) public _nftMeta;

    bytes32 internal keyHash;
    uint256 internal fee;

    mapping(bytes32 => address) requestToSender;

    IERC20 public gameToken;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        address _gameTokenAddress,
        address _VRFcoordinator,
        address _linkToken,
        bytes32 _keyHash
    ) ERC721(_name, _symbol) VRFConsumerBase(_VRFcoordinator, _linkToken) {
        setBaseURI(_initBaseURI);
        gameToken = IERC20(_gameTokenAddress);
        keyHash = _keyHash;
        fee = 0.0001 * 10**18;
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // public

    function orderMysteryBox() public payable returns (bytes32) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        uint256 supply = totalSupply();
        require(!paused);
        require(supply + 1 <= maxSupply);

        if (msg.sender != owner()) {
            if (whitelisted[msg.sender] != true) {
                if (presaleWallets[msg.sender] != true) {
                    //general public
                    require(
                        gameToken.transferFrom(msg.sender, address(this), cost),
                        "Pay Up"
                    );
                } else {
                    //presale
                    require(
                        gameToken.transferFrom(
                            msg.sender,
                            address(this),
                            presaleCost
                        ),
                        "Pay Up"
                    );
                }
            }
        }
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestToSender[requestId] = msg.sender;
        return requestId;
    }

    //refer & earn .
    function orderReferalBox(address _referid)
        public
        payable
        returns (bytes32)
    {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        uint256 supply = totalSupply();
        require(!paused);
        require(supply + 1 <= maxSupply);
        require(balanceOf(_referid) > 0);

        uint256 OfferPrice = cost - (cost * 0.1);

        if (msg.sender != owner()) {
            if (whitelisted[msg.sender] != true) {
                if (presaleWallets[msg.sender] != true) {
                    //general public
                    require(
                        gameToken.transferFrom(
                            msg.sender,
                            address(this),
                            OfferPrice
                        ),
                        "Pay Up"
                    );
                    gameToken.transferFrom(address(this), _referid, cost * 0.1);
                } else {
                    //presale
                    require(
                        gameToken.transferFrom(
                            msg.sender,
                            address(this),
                            presaleCost
                        ),
                        "Pay Up"
                    );
                }
            }
        }
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestToSender[requestId] = msg.sender;
        return requestId;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        uint256 supply = totalSupply();
        _safeMint(requestToSender[requestId], supply + 1);
        _nftMeta[supply + 1] = NFTMeta(
            (randomness % 6) + 1,
            ((randomness % 6) + 1) * 5
        );
    }

    function getLucky(uint256 _id) public view returns (uint256) {
        return _nftMeta[_id].lucky;
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
