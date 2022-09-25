// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;


  //getting a list of the accounts in the node (hardhat network) and only keeping first two.
  const [owner,nft_holder] = await ethers.getSigners();

  const LAN = await hre.ethers.getContractFactory("LAN");
  const lan = await LAN.deploy();

  await lan.deployed();


const baseBidRegistry = await hre.ethers.getContractFactory("BaseBidRegistry");
  const basebidregistry = await baseBidRegistry.deploy();


await basebidregistry.deployed();

//    const Wrapper = await hre.ethers.getContractFactory("Wrapper");
//      const wrapper = await Wrapper.deploy();

// await wrapper.deployed();

  //const [owner,nft_holder] = await ethers.getSigners();


   console.log(`deployed LAN contract to ${lan.address}`)

   console.log(`BaseBidRegistry contract: ${basebidregistry.address}`)

  // console.log(`Wrapper contract: ${wrapper.address}`)


  //now need to send nft to dotenv of accnt 10
  //const res = await nftFactory.connect(owner).createToken("test");

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
