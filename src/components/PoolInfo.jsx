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
    FormHelperText,
    TableContainer,
    Table,
    Thead,
    Tr,
    Td,
    Th,
    Tbody,
    LinkBox,
    LinkOverlay
  } from '@chakra-ui/react';

  
  
  // import Blockies from 'react-blockies';
  
  import { useForm } from "react-hook-form";
  
  import { ethers } from 'ethers'
  
  import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
  //import Jazzicon from 'react-jazzicon';
  import LAN from '../artifacts/contracts/mainliquidations.sol/LAN.json'
    import USDC from '../artifacts/contracts/USDC.sol/USDC.json'

  //   import { ColorModeSwitcher } from './ColorModeSwitcher';
  
  //   import LogoBsc from '../assets/bsc.svg';
  
  import { useEffect, useState } from 'react'
  
  import Logo from '../assets/logo.png';
  import MetaLogo from '../assets/metamask.svg';
  
  import { LAN_ADDRESS, NFT_ADDRESS, USDC_ADDRESS,BASEBIDREGISTRY_ADDRESS } from '../constants'
  
  export default function PoolInfo(props) {

const { register, getValues, handleSubmit, formState: { errors } } = useForm();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prom//pt user for account connections
    //await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(LAN_ADDRESS, LAN.abi, signer)
    // setContract(contract)
    // dumb way to get current timestamp?
  
  const[ loanInfo,setLoanInfo] = useState(null)


// //get list of bids

//     useEffect(() => {
  
//   props.poolId

//         /// @notice Setting and accepting bids for the asset
//     /// @param _poolId Pool ID
//     /// @param _amount Present Value of the bid amount
//     /// @param _apr APR of the bid
//     /// @param _ltv LTV of the loan. Default is 0 if liquidatable isn't turned on.
  
//    contract.loans(props.poolId).then((resp)=>{
//         console.log("got bids ", resp)
//         setBids(resp)
//     })
  
//         //console.log("LOANS: ", loans)
  
      
  
  
//     }, [])

const [currBidNum,setCurrBidNum] = useState(0)
const [bids,setBids] = useState([])
const [bestBid,setBestBid] = useState(null)
 
    const deposit = ()=>{
console.log("(**********")
        console.log( getValues("depositAmount"))

        
//Approve bid
  const usdc = new ethers.Contract(USDC_ADDRESS,USDC.abi, signer)
        console.log("APROVED BID", usdc)
        usdc.approve(props.poolBidId.pool,ethers.utils.parseUnits(getValues("depositAmount"), 18)).then(()=>{
            
            console.log("SUCCESFULLY APPROVED TOKENS")
            //bid after apprval
                 contract.connect(signer).bid(
            props.poolId,
            ethers.utils.parseUnits(getValues("bidAmount"), 18),
            getValues("bidApr"),
            getValues("bidLtv")
                  ).then((resp)=>console.log("BID COMPLETE"))

                  //ideally the contract would emit an event bid rejected r bid accepted
            
            })
    
//
  
    
                
               
    }

    

    
    return(<div>
<VStack>

<Flex>
  Total Assets Supplied: 25000 USDC</Flex>

  <div>Minimum APR: 10%</div>
<FormControl> 
<form onSubmit={handleSubmit(deposit)}>
{/* This could be what exactly just 1 asset can be supplied? */}
<FormLabel as='legend'><Box>Your Assets Supplied: 25000 USDC</Box></FormLabel>
<Input type="text"   placeholder="5000 USDC" {...register("depositAmount")} />
<Button colorScheme='blue' type="submit" >Deposit</Button>
</form>
</FormControl>
  <Flex>


    <Button colorScheme='blue'>Withdraw</Button>
  </Flex>

</VStack>
<div>

<Flex>

<HStack>
Auctions: 
</HStack>
</Flex>
</div>




    </div>)
  }