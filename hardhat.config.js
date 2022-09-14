require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.16",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    forking: {
     // url: "https://eth-mainnet.alchemyapi.io/v2/<key>",
     url:"https://polygon-mainnet.g.alchemy.com/v2/EIEI4ZzvpwpQ3TFIef4ZwTyNc2oc7aPL"
      }
  }
};
