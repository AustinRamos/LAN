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

import { useState } from 'react'

   import Logo from '../assets/logo.png';
   import MetaLogo from '../assets/metamask.svg';
   const LANAddress = "0x1EC66e52D13c18809F023948f1ae053025D2c969"

   const USDC_Address="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

  export default function CreateLendingPool(props) {

    const { register, handleSubmit, formState: { errors } } = useForm();

    console.log("LAN ABI: ", LAN.abi)
    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }

    //   function launch(
    //     address _operator, 
    //     address _token, 
    //     address _collectionAddress, 
    //     address _oracleAddress,
    //     uint256 _nftId, 
    //     uint256 _startTime, 
    //     uint256 _endTime, 
    //     bool _liquidatable,
    //     bool _whitelisted)

      async function createPool() {
       //if (!greeting) return
        if (typeof window.ethereum !== 'undefined') {
          await requestAccount()
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner()
          const contract = new ethers.Contract(LANAddress, LAN.abi, signer)
          
          const transaction = await contract.launch(
            ethers.constants.AddressZero ,
              USDC_Address,
              ethers.constants.AddressZero, //address of nft wrapped?
              ethers.constants.AddressZero, //oracle address
              ethers.constants.AddressZero, //nft_id 
              Date.now(),
              Date.now()+600000,
              false,
              false
          )

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