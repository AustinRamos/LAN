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

   import { LAN_ADDRESS,NFT_ADDRESS,USDC_ADDRESS } from '../constants'  

  
   //process.env.LAN_ADDRESS



   export default function Pools() {


  
//  console.log("PROVIDER: " , provider)
const [count,setCount] = useState(0)
useEffect(()=>{

//get count of auctions: 

   
    const provider = new ethers.providers.Web3Provider(window.ethereum);
 // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
// Prom//pt user for account connections
//await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner()
    const contract = new ethers.Contract(LAN_ADDRESS, LAN.abi, signer)

    console.log("PROVIDER: " , provider)
    console.log("SIGNER: " , signer)
    // dumb way to get current timestamp?
 

//contract.connect
    const transaction = contract.connect(signer).count().then(resp=>{
      //console.log("COUNT GOTTEN -> ", resp.toNumber())
setCount(resp.toNumber())
  })

   // await transaction.wait().then()

})

    return(<div>
    COUNT: 
    {count}
    </div>)
  


  }