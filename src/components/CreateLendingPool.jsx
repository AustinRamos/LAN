import {
    Flex,
    Box,
    Stack,
    HStack,
    Menu,
    Center,
    Button,
    MenuButton,
    Avatar,
    Tooltip,
    Image,
    Link,
    Text,
    AvatarBadge,
    MenuList,
    useColorModeValue,
    Grid,
    Radio,
    FormLabel,
    RadioGroup,
    FormControl,
    Input,
    Select,
    VStack,
    FormHelperText
  } from '@chakra-ui/react';

  // import Blockies from 'react-blockies';

  import { useForm } from "react-hook-form";
  
  import { ethers } from 'ethers'

  import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
  //import Jazzicon from 'react-jazzicon';
  import LAN from '../artifacts/contracts/mainliquidations.sol/LAN.json'

//   import { ColorModeSwitcher } from './ColorModeSwitcher';
  
//   import LogoBsc from '../assets/bsc.svg';

import { useEffect, useState } from 'react'

   import Logo from '../assets/logo.png';
   import MetaLogo from '../assets/metamask.svg';
   require('dotenv').config()
   const LANAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
   //process.env.LAN_ADDRESS

   const USDC_Address="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
   //process.env.USDC_Address
const nft_address="0xE8aB4B54E9209522D387343D50e37b7a540056D1"

  export default function CreateLendingPool(props) {

    const { register, handleSubmit, formState: { errors } } = useForm();

    console.log("LAN ABI: ", LAN.abi)
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      const [provider, setProvider] = useState();
      useEffect(()=>{
      let provider;
    if (window.ethereum) {
      provider = window.ethereum;
      setProvider(provider)
    } else if (window.web3) {
      provider = window.web3.currentProvider;
      setProvider(provider)

    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
      window.open('https://metamask.io/');
    }
})



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

      async function createPool() {
       //if (!greeting) return
        if (typeof window.ethereum !== 'undefined') {
          await requestAccount()
          const provider = new ethers.providers.Web3Provider(window.ethereum);
       // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
// Prom//pt user for account connections
//await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner()
          const contract = new ethers.Contract(LANAddress, LAN.abi, signer)

          console.log("PROVIDER: " , provider)
          console.log("SIGNER: " , signer)
          // dumb way to get current timestamp?
          //const latest_block = ethers.provider.getBlock("latest")
          //const block_num=  await provider.getBlockNumber()
          //console.log("blocknum**: " , block_num)
          const timestamp = (await provider.getBlock("latest")).timestamp;
console.log("*********************timestamp: " , timestamp)

//JS epoch is in milliseconds, solidity is in seconds
const start_time=new Date(timestamp*1000).toLocaleString()
console.log("START TIME: " , start_time )

//contract.connect
          const transaction = await contract.connect(signer).launch(
            // ethers.constants.AddressZero ,
            // ethers.getAddress(USDC_Address),
            // ethers.getAddress(nft_address), //address of nft wrapped?
            //   ethers.constants.AddressZero, //oracle address
            //   5, //nft_id 
              timestamp+600,
              timestamp+60000,
              false,
              false
          )
//const transaction = await contract.test(5)

          await transaction.wait()
          //fetchGreeting()
        }
      }    
    return (<div>
      
        {/* <button onClick={createPool}>Create Pool</button> */}

{/* FORM CONTROL WRAPS FORM OR VICE VERSA? */}
        <FormControl>
<form onSubmit={handleSubmit(createPool)}>
{/* Will this chakra input work instead of input regular */}

<FormLabel as='legend'>Pool Name</FormLabel>

	<Input type="text" placeholder="Pool Party" {...register("poolName")} />
    <FormLabel as='legend'>Base Asset</FormLabel>
  <RadioGroup size="sm" defaultValue='FRAX'>
    <HStack spacing='12px'>
      <Radio size="sm" value='FRAX'>FRAX</Radio>
      <Radio value='WETH'>WETH</Radio>
      <Radio value='USDC'>USDC</Radio>
    </HStack>
  </RadioGroup>

  <FormLabel as='legend'>Admin</FormLabel>
	<Input type="text" placeholder="0x...." {...register("poolName")} />
    
    <FormLabel as='legend'>Max Auction Duration</FormLabel>
    <Select placeholder='Select Duration'>
  <option value='option1'>7 days</option>
  <option value='option2'>14 days</option>
  <option value='option3'>28 days</option>
</Select>
  
  <FormLabel as='legend'>Assets</FormLabel>
  <VStack>
  <HStack>
  <FormHelperText>Address</FormHelperText>
  <FormHelperText>LTV</FormHelperText>
  <FormHelperText>API</FormHelperText>
  <FormHelperText>Oracle</FormHelperText>
  </HStack>
  <HStack spacing='12px'>
  {/* Register Assets  */}
  
	<Input type="text" placeholder="0x...." {...register("poolName")} />
    <Input type="text" placeholder="LTV" {...register("poolName")} />
	<Input type="text" placeholder="LowestApi" {...register("poolName")} />
	<Input type="text" placeholder="Oracle Address" {...register("poolName")} />

    </HStack>
    <HStack spacing='12px'>
  {/* Register Assets  */}
	<Input type="text" placeholder="0x...." {...register("poolName")} />
    <Input type="text" placeholder="LTV" {...register("poolName")} />
	<Input type="text" placeholder="LowestApi" {...register("poolName")} />
	<Input type="text" placeholder="Oracle Address" {...register("poolName")} />

    </HStack>
    <HStack spacing='12px'>
  {/* Register Assets  */}
	<Input type="text" placeholder="0x...." {...register("poolName")} />
    <Input type="text" placeholder="LTV" {...register("poolName")} />
	<Input type="text" placeholder="LowestApi" {...register("poolName")} />
	<Input type="text" placeholder="Oracle Address" {...register("poolName")} />

    </HStack>
 </VStack>


 <FormLabel as='legend'>Advanced:</FormLabel>



	<Button type="submit" > Create Pool</Button>
</form>
</FormControl>
    </div>
    );}