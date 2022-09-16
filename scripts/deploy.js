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

  const lockedAmount = hre.ethers.utils.parseEther("1");

  // const Lock = await hre.ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // await lock.deployed();

  //getting a list of the accounts in the node (hardhat network) and only keeping first one.
  const [owner] = await ethers.getSigners();

  const LAN = await hre.ethers.getContractFactory("LAN");
  const NFT_Factory = await hre.ethers.getContractFactory("SimpleNft");
  const nftFactory = await NFT_Factory.deploy();
  const lan = await LAN.deploy();

  await lan.deployed();

  await nftFactory.deployed();

const address = await owner.getAddress()
  console.log("owner: " , address);

  // console.log(
  //   `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );
  console.log(`deployed LAN contract to ${lan.address}`)
  console.log("deployed nft: ",nftFactory.address)

    await nftFactory.connect(owner).mint(0)

  //now need to send nft to dotenv of accnt 10
  //const res = await nftFactory.connect(owner).createToken("test");

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
