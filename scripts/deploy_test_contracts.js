  
  
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    const [owner,nft_holder] = await ethers.getSigners();

  const NFT_Factory = await hre.ethers.getContractFactory("SimpleNft");
  const nftFactory = await NFT_Factory.deploy();


    await nftFactory.deployed();

    //mock usdc and mint to 0xf39
    const USDC_CONTRACT = await hre.ethers.getContractFactory("USDC");
  const usdc = await USDC_CONTRACT.deploy(ethers.utils.parseUnits("1000000", 18))

 await usdc.deployed();

  console.log("USDC contract: " , usdc.address);
   //getbalanceof?

   //so need to put usdc address into constants and metamask...

  // console.log(
  //   `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );

  console.log("deployed nft: ",nftFactory.address)
    await nftFactory.connect(nft_holder).mint(0)
      await nftFactory.connect(owner).mint(1)



  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});