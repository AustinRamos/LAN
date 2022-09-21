// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./BaseBidding.sol";
import "./IPriceOracle.sol";

/// @notice Simple implementation of basebid. too hard to debug others
/// @title BaseBid3
/// @author Austin
/// Single bidding contract, no external depositing

// interface IPriceOracle {
//     // Standardize oracle output
//     // Return price of asset in WETH terms, (1e18)
//     //unsure about quote 
//     function getUnderlyingPrice(address underlying) external view returns (uint256);
//     function getBundlePrice(address wrapper, uint256 nftId) external returns(uint256);
// }

interface IWrapper {
    function getAmounts(uint256 _nftId)
        external
        view
        returns (uint256[] memory);

    function getTokens(uint256 _nftId) external view returns (address[] memory);
}
interface Base_Bid_Registry{
    function addBaseBid(address) external ;
}

contract BaseBid3  {
     using Math for uint;

     struct Term {
            uint256 poolId;
            uint256 LTV;
            address oracle;
    }
     /// @notice Only Admin can operate
     modifier  onlyOwner() {
        require(msg.sender == admin, "BaseBid: not owner");
        _;
    }


    ILan private Lan; //insert deployment here
    IWrapper private  Wrapper;



       address admin;
        address baseAsset;
        address baseAssetOracle;
        address LANContract;
        bool liquidationOnly;
        uint16 kink;
        uint256 minApr; //minapr put back in later.
        uint256 longestTerm;
        uint256 adminFee; //PUT MINAPR BACK IN...
        address baseBidRegistry;
        uint256 public cash;
    constructor(
        address _baseBidRegistry,
        address _admin,
        address _baseAsset,
        address _baseAssetOracle,
        address _LANContract,
        address _Wrapper,
        bool _liquidationOnly,
        uint16 _kink,
        uint256 _minApr, //minapr put back in later.
        uint256 _longestTerm,
        uint256 _adminFee

    )

    {
        admin = _admin;
        baseAsset = _baseAsset;
        baseAssetOracle = _baseAssetOracle;
        LANContract = _LANContract;
        kink = _kink;
        minApr = _minApr;
        liquidationOnly = _liquidationOnly;
        longestTerm = _longestTerm;
        adminFee = _adminFee;
        //windDown = false;
        //infinite token approval for LAN
        IERC20(baseAsset).approve(_LANContract, type(uint256).max);
        Wrapper = IWrapper(_Wrapper);
       Lan = ILan(_LANContract);
       Base_Bid_Registry(_baseBidRegistry).addBaseBid(address(this));
    }

        mapping(address => Term) public whitelists;
    
    
    function getDetails() external view returns (
            address,
            address,
            uint,
            uint,
            uint,
            bool
    ){
            return (
                admin,
                baseAsset,
                minApr,
                longestTerm,
                adminFee,
                liquidationOnly
            );

    }

 /// @notice Deposit
    /// @param _tokenAmount is amount deposited    
    function deposit(uint256 _tokenAmount) public {
        cash+=_tokenAmount;
                IERC20(baseAsset).transferFrom(msg.sender, address(this), _tokenAmount);
    }
    
    /// @notice Withdraw
    /// @param _tokenAmount is amount withdrawn 
    function withdraw(uint256 _tokenAmount) public onlyOwner(){}

//     /// @notice Add whitelist asset to vault
//     /// @param _token is token address
//     /// @param _LTV is the LTV of the asset
//     /// @param _oracle is the oracle that will be queried. Oracle should implement IPriceOracle
//     // function addWhitelist(uint246 _poolId, address _token, uint256 _LTV, address _oracle) public virtual onlyOwner(){}
    

//     /// @notice Liquidate Auction if the auction can be liquidated.
//     /// @param _poolId The pool ID
//     function liquidateAuction(uint256 _poolId) public virtual override {}

//     /// @notice Call the LAN contract and make a bid with specific parameters. LTV is determined inclusive of accrued interest.
//     /// Update utilization when the loan is issued.
//     /// @param _poolId The pool ID
//     /// @param _borrowAmount The amount requested to borrow
//     /// @param _apr The APR for the borrow
//     function bidWithParams(uint256 _poolId, uint256 _borrowAmount, uint256 _apr) public virtual override {}

//    // function automaticBid(uint256 _poolId) public virtual {}
    
//     function pause() external virtual onlyOwner() override{}

//     /// @notice Sum the value of whitelisted assets contained in the NFT wrapper. Nonwhitelisted assets are 0.
//     /// @param _poolId The pool ID
//     function _calculateLTV(uint256 _poolId) internal virtual override{}

  
}