// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IPriceOracle {
    // Standardize oracle output
    // Return price of asset in WETH terms, (1e18)
    //unsure about quote 
    function getUnderlyingPrice(address underlying) external view returns (uint256);
    function getBundlePrice(address wrapper, uint256 nftId) external returns(uint256);
}