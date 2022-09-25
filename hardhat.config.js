require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.16",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/OTKd2wL3g6nUyu7id7-cTSqx9p-a_LqR`,
      accounts: ['bdc74df63963d0a70b5d1d42eb671b6c4cd5deb5d871fa79eef3a24e23145fe2','b9309cc127a7a3a7190fa75f5eb81277bef3bc37c5c007c56a09cd620e45cf78','55707e02cc97434c7873fa31643ea4bf21fc87905dccf6fc2f248e37fb2dece9','cd413eeda8de01e2cf87ff7a073fa2f0ad489708362c9991ba54a7038f8e5952']
    },
    forking: {
       enabled: true,
      url: "https://eth-mainnet.alchemyapi.io/v2/l5p8SCZIY8Mn3xdCoeVBnQSygaSJntig",
    // url:`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API}`
      }
  }
};
