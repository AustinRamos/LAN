#LAN

LAN project showcase: https://ethglobal.com/showcase/lan-o0r1y


** To see demo with example loan/pool listings, switch metamask to Goerli!**



LAN is a novel NFT lending platform which combaines Peer to Peer and Peer to Pool lending. Users(Owners of NFT's) can create lending auctions for their NFT's. When they create an auction, the NFT is transferred to the contract.Users can alsos bid directly on it according to their own estimated value. If the loan value(loan amount + interest rate over loan period) is better than the existing bid

The core usse case however is automatic bidding lending pools which facilitate the 'price discovery' of the loan.
Like a rari pool, admins can create lending pools for certain bluechip nft's. they will advertise a certain min apr rate the pool generates which defines the lower bound on 
lending pool uses chainlink oracles for bluechip nft's. Dao's can be admin of lending pools and can vote to allow non oracle based bidding as well.


![Alt text](./public/auctions.jpg?raw=true "List of Current Auctions")

![Alt text](./public/auction.jpg?raw=true "Example NFT Auction with bidding.")



```shell

1) npm install --legacy-peer-deps

 
2) npm run mainnet_fork 
-> npx hardhat node --fork https://polygon-mainnet.g.alchemy.com/v2/EIEI4ZzvpwpQ3TFIef4ZwTyNc2oc7aPL
    ->todo: replace hardcoded key with dotenv

    (in new terminal)
3) npx hardhat run scripts/deploy.js --network localhost 


//start react app
npm start



```


in Constants.js put
LAN_ADDRESS
ALCHEMY_API (keep mine for now)



current work->

integrate bid and Auctionstats page