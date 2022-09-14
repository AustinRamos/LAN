pragma solidity ^0.8.16;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Wrapper is ERC721{
    uint256 public count;

    constructor() public ERC721("LanBundle", "LAN") {}

    function wrap(address[] calldata _tokens, uint256[] calldata _amounts) external {
        _mint(msg.sender, count++);
    }

    function getTokens(uint256 _nftId) external view returns (address[] memory) {

    }
    
    function getAmounts(uint256 _nftId) external view returns (uint256[] memory) {

    }
}