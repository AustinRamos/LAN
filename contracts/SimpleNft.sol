// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
contract SimpleNft is ERC721, Ownable{
    using Counters for Counters.Counter;

Counters.Counter private _tokenIdCounter;

   constructor() ERC721("SimpleNFT", "SFT") {}
     function createToken(string memory tokenURI) public returns (uint) {
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();

        _mint(msg.sender, newItemId);
       // _setTokenURI(newItemId, tokenURI);

        return newItemId;
}
}