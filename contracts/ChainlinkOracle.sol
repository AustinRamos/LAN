// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./IPriceOracle.sol";
import "./Denominations.sol";

    // function getUnderlyingPrice(address underlying,address quote) external view returns (uint256);
    // function getBundlePrice(address wrapper, uint256 nftId) external view returns(uint256);

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);

    function latestRoundData(address base, address quote)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

interface IWrapper {
    function getAmounts(uint256 _nftId)
        external
        view
        returns (uint256[] memory);

    function getTokens(uint256 _nftId) external view returns (address[] memory);
}

contract ChainlinkOracle is IPriceOracle {
    //Chainlink Feed Registry are currently available on eth mainnet
    AggregatorV3Interface private constant feedRegistry =
        AggregatorV3Interface(0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf);
    event Log(string message);

    function getBundlePrice(address wrapper, uint256 nftId) external  returns(uint256) {

        address[] memory  tokens = IWrapper(wrapper).getTokens(nftId);
        uint256[] memory amounts = IWrapper(wrapper).getAmounts(nftId);
        // loop through all assets and calculate borrowable USD
        uint256 totalPriceUSD; // 18 decimal places
        uint256 length = tokens.length;

        for (uint256 i = 0; i < length; ) {
            // getUnderlyingPrice returns price in 18 decimals and USD

        //the interface states that it should return zero when the price is unavailable.
            // function getUnderlyingPrice(address underlying,address quote) external view returns (uint256);

        uint256 underlyingPrice = _getUnderlyingPrice(wrapper);
        
            if(underlyingPrice==0)
            {
                totalPriceUSD += underlyingPrice;
                 ++i;
            } else {
                emit Log("Chainlink call failed for this asset");
                //should revert if CL call fails?
                revert(); 
           
        }

        }
             return totalPriceUSD;
    }
    
    // todo implement interface with Wrapper @junion
    // rejigger CL stuff, the link to the imports above is https://raw.githubusercontent.com/Rari-Capital/fuse-contracts/master/contracts/external/chainlink/AggregatorInterface.sol

    function getUnderlyingPrice(address _underlying)
        external
        view
        returns (uint256)
    {
        return _getUnderlyingPrice(_underlying);
    }

    // default return type is USD price for collateral. Will fail if there deosn't exist a USD pair
    // ToDo: add eth pair mode as well
    function _getUnderlyingPrice(address underlying)
        internal
        view
        returns (uint256)
    {
        //there is this concept address quote  ISO 4217 standard as per https://docs.chain.link/docs/feed-registry/#base-and-quote

        address quote = Denominations.USD;
        /*
        try feedRegistry.latestRoundData(underlying, Denominations.USD) returns (,int256 tokenUsdPrice,,,) {

        (underlyingPrice 10 ** uint256(feedRegistry.decimals(underlying, Denominations.USD))
        */
        uint8 decimals = feedRegistry.decimals();
        (, int256 underlyingPrice, , , ) = feedRegistry.latestRoundData(
            underlying,
            quote
        );
        
        return
        //overflow/underflow checks default in compiler in 0.8
            uint256((underlyingPrice) * (1e26)) /(
                10 **
                    uint256(
                        decimals
                    )
            );
    }
}
