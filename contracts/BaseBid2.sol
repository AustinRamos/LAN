// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.16;
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/utils/math/Math.sol";
// import "./BaseBidding.sol";


// /// @notice Base implementation of BaseBid
// /// @title BaseBid1
// /// @author William, Junion
// /// Single bidding contract, no external depositing
// interface IPriceOracle {
//     // Standardize oracle output
//     // Return price of asset in WETH terms, (1e18)
//     function getUnderlyingPrice(address underlying)
//         external
//         view
//         returns (uint256);
// }

// interface IWrapper {
//     function getAmounts(uint256 _nftId)
//         external
//         view
//         returns (uint256[] memory);

//     function getTokens(uint256 _nftId) external view returns (address[] memory);
// }

// contract BaseBid2 is BaseBidding {
//      using Math for uint;
//     // event newLoan(
//     //     address collectionAddress,
//     //     uint16 apr,
//     //     uint256 poolId,
//     //     uint256 bidAmount
//     // );

//     //UNCOMMENT THIS LATER
//     //uint16 public kink;
//     // uint256 public minapr;
//      //uint256 public cash;
//     // uint256 public longestTerm;
//     // uint256 public immutable adminFee;

//     ILan private constant Lan = ILan(address(0)); //insert deployment here
//     IWrapper private constant Wrapper = IWrapper(address(0));


//     constructor(
//         address _admin,
//         address _baseAsset,
//         address _baseAssetOracle,
//         address _LANContract,
//         bool _liquidationOnly,
//         //uint16 _kink,
//         uint256 minApr, //minapr put back in later.
//         uint256 _longestTerm,
//         uint256 _adminFee//PUT MINAPR BACK IN...
//     )
//         BaseBidding(
//             _admin,
//             _baseAsset,
//             _baseAssetOracle,
//             _LANContract,
//             _liquidationOnly,
//             0, 
//             _longestTerm,
//             _adminFee
//         )
        
//     {
//         admin = _admin;
//         baseAsset = _baseAsset;
//         baseAssetOracle = _baseAssetOracle;
//         LAN = ILan(_LANContract);
//         //kink = _kink;
//         minApr = 0;
//         liquidationOnly = _liquidationOnly;
//         longestTerm = _longestTerm;
//         adminFee = _adminFee;
//         windDown = false;
//         //infinite token approval for LAN
//         IERC20(baseAsset).approve(_LANContract, type(uint256).max);
//     }

//     mapping(address => Term) public whitelists;

//      /// @notice Only Admin can operate
//     // modifier onlyOwner{
//     //     require(msg.sender == admin, "BaseBid: not owner");
//     //     _;
//     // }

//     /// @notice Add whitelist asset to vault
//     /// @param _token is token address
//     /// @param _LTV is the LTV of the asset
//     /// @param _oracle is the oracle that will be queried. Oracle should implement IPriceOracle
//     // function addWhitelist(
//     //     address _token,
//     //     uint256 _LTV,
//     //     address _oracle,
//     //     //********* I ADDED POOLID HERE BC ITS IN TERM BUT NOT SURE IF IT IS SUPPOSED TO BE */
//     //     uint256 _poolId 
//     // ) public virtual override onlyOwner {
//     //     whitelists[_token] = Term({poolId:_poolId,LTV: _LTV, oracle: _oracle});
//     // }

//     // /// @notice Remove whitelist
//     // /// @param _token is token address
//     // function removeWhitelist(address _token) external onlyOwner {
//     //     delete whitelists[_token];
//     // }

//     /// @notice Deposit
//     /// @param _tokenAmount is amount deposited
//     function deposit(uint256 _tokenAmount) public override shutdown {
//         IERC20(baseAsset).transferFrom(msg.sender, address(this), _tokenAmount);
//         //cash += _tokenAmount;
//     }

//     /// @notice Withdraw
//     /// @param _tokenAmount is amount withdrawn
//     function withdraw(uint256 _tokenAmount) public override onlyOwner {
//         IERC20(baseAsset).transferFrom(msg.sender, address(this), _tokenAmount);
//        // cash -= _tokenAmount;
//     }

//     // /// @notice Pause, no new loans get issued.
//     // function pause() external override onlyOwner {
//     //     windDown = true;
//     // }

//     /// @notice Liquidate Auction if the auction can be liquidated. Asset is kept in contract but approved to the owner
//     /// Owner can withdraw at any time, but if admin is changed, the approval isn't updated.
//     /// @param _poolId The pool ID
//     function liquidateAuction(uint256 _poolId) public virtual override onlyOwner {
//         try LAN.liquidate(_poolId) {
//             (
//                 ,
//                 ,
//                 ,
//                 ,
//                 address collectionAddress,
//                 uint256 nftId,
//                 ,
//                 ,
//                 ,
//                 ,
//                 ,

//             ) = this.readLoan(_poolId);
//             // so confused, why is readLoan not working. could be because it isn't working on baseBidding. Happy debugging :)
//             IERC721(collectionAddress).approve(admin, nftId);
//         } catch (bytes memory reason) {
//            // emit log(reason);
//         }
//     }

//     /// @notice Call the LAN contract and make a bid with specific parameters. LTV is determined inclusive of accrued interest.
//     /// Update utilization when the loan is issued.
//     /// @param _poolId The pool ID
//     /// @param _borrowAmount The amount requested to borrow
//     /// @param _apr The apr for the borrow
//     function bidWithParams(
//         uint256 _poolId,
//         uint256 _borrowAmount,
//         uint256 _apr
//     ) public override shutdown onlyOwner {
//         require(_apr >= 0, "BaseBid: apr below minapr");
//         (
//             ,
//             address token,
//             ,
//             ,
//             address collectionAddress,
//             ,
//             uint256 nftId,
//             ,
//             uint256 endTime,
//             ,
//             bool liquidatable,

//         ) = this.readLoan(_poolId);

//        uint256 ltv = _calculateLTV(nftId, endTime, _apr);
//         require(liquidatable == true, "Basebid: Liquidatable not true");
//         require(token == baseAsset, "BaseBid: different base asset");
//         require(
//             collectionAddress == address(Wrapper),
//             "BaseBid: Collateral not in a wrapper"
//         );
//         require(
//             _calculateLTV(nftId, endTime, _apr) >= _borrowAmount,
//             "BaseBid: Borrow Amount too high"
//         );
//         try LAN.bid(_poolId, _borrowAmount, _apr,ltv) {
//             emit newLoan(collectionAddress, _apr, _poolId, _borrowAmount);
//            // _utilization();
//         } catch (bytes memory reason) {
//             //emit log(reason);
//         }
//     }

//     /// @notice Sum the value of whitelisted assets contained in the NFT wrapper. Nonwhitelisted assets are 0.
//     /// @param nftId The ID of the NFT for the wrapper contract
//     /// @param endTime The amount requested to borrow
//     /// @param apr The apr for the borrow
//     function _calculateLTV(
//         uint256 nftId,
//         uint256 endTime,
//         uint256 apr
//     ) internal returns (uint256) {
//         address[] memory tokens = Wrapper.getTokens(nftId);
//         uint256[] memory amounts = Wrapper.getAmounts(nftId);

//         // loop through all assets and calculate borrowable USD
//         uint256 borrowableUSD; // 18 decimal places
//         uint256 length = tokens.length;
//         for (uint256 i = 0; i < length; ) {
//             Term memory whitelist = whitelists[tokens[i]];
//             // Check if token is on whitelist - skip if not
//             if (whitelist.oracle != address(0)) {
//                 // getUnderlyingPrice returns price in 18 decimals and USD
//                 uint256 collateralPrice = IPriceOracle(whitelist.oracle)
//                     .getUnderlyingPrice(tokens[i]);
//                 uint256 ltvAmt = amounts[i].mulDiv(
//                     whitelist.LTV,
//                     1e18
//                 );
//                 borrowableUSD += ltvAmt.mulDiv(collateralPrice, 1e18);
//             }
//             unchecked {
//                 ++i;
//             }
//         }
//         uint256 elapsedTime = endTime - block.timestamp;
//         uint256 basePrice = IPriceOracle(baseAssetOracle).getUnderlyingPrice(
//             baseAsset
//         );
//         uint256 loanValue = _calculateLoanValue(
//             borrowableUSD,
//             elapsedTime,
//             apr
//         );
//         return loanValue / basePrice;
//     }
   

//     // /// @notice Automatically bid the highest possible bid, using bidWithParams
//     // /// @param _poolId Pool ID
//     // function automaticBid(uint256 _poolId) public override shutdown onlyOwner {
//     //     (, , , , , uint256 apr, uint256 nftId, , , , , ) = this.readLoan(_poolId);
//     //     //uint256 ltv = _calculateLTV(nftId);
        
//     //     //taking this out for now, doesnt make sense to me how it will figure out the bid amount...

//     //    // bidWithParams(_poolId, ltv, apr);
//     // }

//     /// @notice Change the minapr based on the # of assets deposited (cash), and # of assets currently inside (reserves)
//     // function _utilization() internal {
//     //     // compound Jump rate Model kinda

//     //     uint256 reserves = IERC20(baseAsset).balanceOf(address(this));
//     //     uint16 util = uint16(reserves / cash);

//     //     //UNCOMMENT THIS
//     //     // if (util <= kink) {
//     //     //     // Increase minapr with utilization linearly
//     //     //     minapr += util * 10**19;
//     //     // } else {
//     //     //     // Change linear slope by 10x
//     //     //     minapr += util * 10**20;
//     //     // }
//     //     minapr += util * 10**19;
//     // }

//         /// @notice Read LAN for Loan details
//     /// @param _poolId The pool ID
//     function readLoan(uint256 _poolId) view virtual external override returns(
//         address owner, 
//         address token, 
//         address operator,
//         address oracleAddress,        
//         address collectionAddress, 
//         uint256 apr, 
//         uint256 nftId, 
//         uint256 startTime, 
//         uint256 endTime, 
//         uint256 numBids,
//         bool liquidatable,
//         bool whitelisted) 
//         {
//         return(LAN.getLoan(_poolId));
//         //not sure how to read a struct through a mapping from another contract without inheritance
//     }
// }

