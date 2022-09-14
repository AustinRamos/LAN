#LAN


npm install --legacy-peer-deps





```shell
 
npx hardhat node

  or 

npx hardhat node --fork https://polygon-mainnet.g.alchemy.com/v2/EIEI4ZzvpwpQ3TFIef4ZwTyNc2oc7aPL
    -fork poly main net with my alchemy api key
(actually instead of this make a custom script which calls npm run polygonfork 
and that script will get key from dotenv)


npx hardhat run scripts/deploy.js --network localhost






```


in .dotenv put
LAN_ADDRESS, SimpleNFT_ADDRESS , ALCHEMY_API