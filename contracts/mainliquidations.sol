// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
//import "./IPriceOracle.sol";

/// @title LAN: unopinianated lending infrastructure for literally any nft
/// @author William, Junion, Austin
/// @notice Code is really rough and likely contains bugs :)
// interface IPriceOracle {
//     uint256 price;
// }

interface ILiquidationOracle{
    function getUnderlyingPrice(address) external returns (uint);
}

contract LAN{

    event newPool(
        uint256 indexed poolId,
        address collectionAddress,
        uint256 nftId
    );

    event loanCancelled(uint256 Id);

    event loanEnded(
        uint256 poolId
    );
    
    /// @notice Count number of loans, both expired and active
    uint256 public count;

    /// @notice Clarifying the terms of the loan struct
    /// @param _owner, owner of the auction
    /// @param _token, base borrowable asset, only one per loan.
    /// @param _operator, EOA or normal Contract. Can act on behalf of owner.
    /// @param _oracleAddress, address for the collection address asset. Default is ChainlinkOracle.sol Requires liquidatable = true
    /// @param _collectionAddress, address for the Wrapper NFT, although this could be literally any NFT
    /// @param _apr, APR for the loan
    /// @param _nftId, nftId
    /// @param _startTime, the startTime of the loan in blocks
    /// @param _endTime, the endTime of the loan in blocks
    /// @param _numBid, the number of bids, keep track of the latest bid
    /// @param _liquidatable, if the loan can be liquidatable
    /// @param _whitelisted, if the loan is whitelisted to only approved bidders
    struct Loan {
        address owner;
        address token;
        address operator;
        address oracleAddress;        
        address collectionAddress;
        uint256 apr;
        uint256 nftId;
        uint256 startTime;
        uint256 endTime;
        uint256 numBids;
        // True if liquidatable, False if not
        bool liquidatable;
        // True if whitelisted mode on, False if not
        bool whitelisted;
    }
    /// @notice Keeping track of loans. PoolId => loans
    mapping(uint256 => Loan) public loans;

    struct Bid {
        uint256 bidTime;
        uint256 bidAmount;
        address user;
        uint256 apr;
        uint16 ltv;
    }

    /// @notice Mapping from PoolID => Bid Number => Bid. Keep track of bids
    mapping(uint256 => mapping(uint256 => Bid)) public bids;

    /// @notice Mapping from PoolID => Bidder Address => bool. True = Whitelisted, False = not. Wh
    mapping(uint256 => mapping(address => bool)) public whitelistedAddresses;

    /// @notice Mapping from PoolID => User Funds. Tracks repayments from users. Funds aren't transferred to the borrower, but are kept.
    mapping(uint256 => uint256) public userPoolReserve;

    uint256 private constant SECONDS_IN_ONE_YEAR = 60*60*24*365;

    /// @notice Only Owner and Operator (if set) can control this position
    /// @param _poolId the ID for the pool
    modifier onlyOwner(uint256 _poolId){
        require((loans[_poolId].owner == msg.sender)
        ||(loans[_poolId].operator == msg.sender), "LAN: not owner");
        _;
    }

    /// @notice Launching the auction
    /// @param _operator, EOA or normal Contract. Can act on behalf of owner to rollover a loan. Set address(0) if not used
    /// @param _token, base borrowable asset, only one per loan.
    /// @param _oracleAddress, address for the collection address asset. Default is ChainlinkOracle.sol Requires liquidatable = true
    /// @param _collectionAddress, address for the Wrapper NFT, although this could be literally any NFT
    /// @param _nftId, nftId
    /// @param _startTime, the startTime of the loan in blocks
    /// @param _endTime, the endTime of the loan in blocks
    /// @param _liquidatable, if the loan can be liquidatable
    /// @param _whitelisted, if the loan is whitelisted to only approved bidders
    function launch(
        address _operator, 
        address _token,  
        address _oracleAddress,
        address _collectionAddress,
        uint256 _nftId, 
        uint256 _startTime, 
        uint256 _endTime, 
        bool _liquidatable,
        bool _whitelisted) public {
        require(_startTime >= block.timestamp, "LAN: start time in past");
        require(_endTime > _startTime, "LAN: start after end");
        loans[count] = Loan({
            owner: IERC721(_collectionAddress).ownerOf(_nftId),
            operator: _operator,
            token: _token,
            oracleAddress: _oracleAddress,
            collectionAddress: _collectionAddress,
            nftId: _nftId,
            startTime: _startTime,
            endTime: _endTime,
            apr: 0,
            numBids: 0,
            liquidatable: _liquidatable,
            whitelisted: _whitelisted
        });
        bids[count][0].bidTime = block.timestamp;
        emit newPool(count, _collectionAddress, _nftId);
        count++;
    }
    
    /// @notice Setting and accepting bids for the asset
    /// @param _poolId Pool ID
    /// @param _amount Present Value of the bid amount
    /// @param _apr APR of the bid
    /// @param _ltv LTV of the loan. Default is 0 if liquidatable isn't turned on.
    // function bid(uint256 _poolId, uint256 _amount, uint256 _apr, uint16 _ltv) external {
    //     require(_started(_poolId), "LAN: not started");
    //     require(!_ended(_poolId), "LAN: already ended");
    //     Loan storage loan = loans[_poolId];
    //     // Check if it's whitelisted and if so, the address is whitelisted
    //     require((loan.whitelisted) && (whitelistedAddresses[_poolId][msg.sender])
    //      || (loan.whitelisted == false), "LAN: Not Whitelisted");
    //     // Check the latest bid, calculate by PV (including accrued interest)
    //     uint loanValue = _calculateLoanValue(_poolId);
    //     require(_amount > loanValue, "LAN: bid not higher");
    //     Bid memory newBid = Bid({
    //         bidTime: block.timestamp,
    //         bidAmount: _amount,
    //         user: msg.sender,
    //         apr: _apr,
    //         ltv: _ltv
    //     });
    //     // Check if loan will be liquidated immediately if liquidatable param is turned on.
    //     assert((_liquidate(loan, newBid, _poolId) && loan.liquidatable), "LAN: Loan is liquidated immediately");
    //     // Update and transfer tokens to right people.
    //     bids[_poolId][loan.numBids] = newBid;
    //     loan.apr = _apr;
    //     uint256 numBids = loan.numBids + 1;
    //     loan.numBids = numBids;
    //     IERC20(loan.token).transferFrom(msg.sender, bids[_poolId][numBids].user, loanValue);
    //     IERC20(loan.token).transferFrom(msg.sender, loan.owner, _amount - loanValue);
    // }
    
    /// @notice Transferring a bid to another address. Ignores whitelist if there is one. Similar to the NFTfi Promissory Note
    /// @param _poolId Pool ID
    /// @param _newAddress New owner of debt position
    function setNewBidOwner(uint256 _poolId, address _newAddress) external {
        require(_started(_poolId), "LAN: not started");
        require(!_ended(_poolId), "LAN: already ended"); 
        Loan memory loan = loans[_poolId];
        Bid storage latestBid = bids[_poolId][loan.numBids];
        require(latestBid.user == msg.sender, "LAN: Not the latest bidder");
        latestBid.user = _newAddress;
    }
    
    /// @notice Update Whitelist status. 
    /// @param _poolId pool ID
    /// @param _whitelist status. True = Whitelist, False = no Whitelist
    function whitelistStatusUpdate(uint256 _poolId, bool _whitelist) external onlyOwner(_poolId){
        Loan storage loan = loans[_poolId];
        loan.whitelisted = _whitelist;
    }

    /// @notice Update Whitelist members. Change Whitelist members. Requires Whitelist = True to take action.
    /// @param _poolId pool ID
    /// @param _newAddress Address
    /// @param _status status. True = WL'd, False = Not WL'd 
    function changeWhitelist(uint256 _poolId, address _newAddress, bool _status) external {
        whitelistedAddresses[_poolId][_newAddress] = _status;
    }

    /// @notice Cancel Auction if it hasn't started
    /// @param _poolId pool ID
    function cancel(uint256 _poolId) external onlyOwner(_poolId) {
        Loan memory loan = loans[_poolId];
        require(loan.startTime > block.timestamp, "LAN: already started");
        delete loan;
        emit loanCancelled(_poolId);
    }

    /// @notice Pay down the loan to restore the Health Factor, or end the loan prematurely
    /// @param _poolId pool ID
    /// @param _amount amount to pay back
    function repay(uint256 _poolId, uint _amount) external onlyOwner(_poolId){
         // transfer tokens to latest bidder
        Loan memory loan = loans[_poolId];
        Bid memory latestBid = bids[_poolId][loan.numBids];

        IERC20(loan.token).transferFrom(msg.sender, address(this), _amount);
        if(_amount + userPoolReserve[_poolId] >= _calculateLoanValue(_poolId)) {
            // End loan
            IERC721 NFT = IERC721(loan.collectionAddress);
            NFT.safeTransferFrom(address(this), latestBid.user, loan.nftId);
            emit loanEnded(_poolId);
            delete loan;
        }
        userPoolReserve[_poolId] += _amount;
    }

    /// @notice Liquidate the NFT if the loan is over without a repayment, or if Liquidatable=True, and the loan is liquidated.
    /// @param _poolId pool ID
    // function liquidate(uint256 _poolId) external {
    //     Loan memory loan = loans[_poolId];
    //     Bid memory latestBid = bids[_poolId][loan.numBids];
    //     require(
    //         ((latestBid.user == msg.sender) && _ended(_poolId)) || 
    //         (loan.liquidatable && _liquidate(loan, latestBid, _poolId)), "LAN: not latest bidder/notover, or not liquidatable");
    //     // transfer NFT
    //     IERC721 NFT = IERC721(loan.collectionAddress);
    //     NFT.safeTransferFrom(address(this), latestBid.user, loan.nftId);
    //     emit loanEnded(_poolId);
    //     delete loan;
    // }

    /// @notice Check if the loan is liquidatable
    /// @param loan the current loan
    /// @param latestBid the latest bid
    /// @param _poolId pool Id
    function _liquidate(Loan calldata loan, Bid calldata latestBid, uint256 _poolId) internal returns (bool){
        uint256 currentPrice = ILiquidationOracle(loan.oracleAddress).getUnderlyingPrice(loan.collectionAddress)/ILiquidationOracle(loan.oracleAddress).getUnderlyingPrice(loan.token);
        if ((latestBid.bidAmount - userPoolReserve[_poolId])/(latestBid.ltv*currentPrice) >= 1){
            return false;
        }
        return true;
    }

    /// @notice Liquidate early if the borrower so chooses. 
    /// @param _poolId pool Id
    function liquidateEarly(uint256 _poolId) external onlyOwner(_poolId) {
        Loan memory loan = loans[_poolId];
        Bid memory latestBid = bids[_poolId][loan.numBids];
        // transfer NFT
        IERC721 NFT = IERC721(loan.collectionAddress);
        NFT.safeTransferFrom(address(this), latestBid.user, loan.nftId);
        emit loanEnded(_poolId);
        delete loan;
    }
    
    /// @notice Calculate loan value (Principal + accrued interest) at block.timestamp
    /// @param _poolId pool Id
    function _calculateLoanValue(uint256 _poolId) internal view returns (uint256){
        Loan memory loan = loans[_poolId];
        Bid memory latestBid = bids[_poolId][loan.numBids];
        uint256 timeElapsed;
        if(_ended(_poolId)){
            timeElapsed =  latestBid.bidTime - loan.endTime;
        } else {
            timeElapsed =  latestBid.bidTime - block.timestamp;
        }
        return latestBid.bidAmount + latestBid.bidAmount * loan.apr / 10 ** 18 * timeElapsed / SECONDS_IN_ONE_YEAR;
    }
    
    function _ended(uint256 _poolId) internal view returns (bool){
        return loans[_poolId].endTime <= block.timestamp;
    }
    function _started(uint256 _poolId) internal view returns (bool){
        return loans[_poolId].startTime < block.timestamp;
    }
}