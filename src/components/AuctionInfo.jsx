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
  
  import { LAN_ADDRESS, NFT_ADDRESS, USDC_ADDRESS } from '../constants'
  
  export default function AuctionInfo(props) {
console.log("POOLID: ",props.poolId)

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


    useEffect(() => {
  
  
        /// @notice Setting and accepting bids for the asset
    /// @param _poolId Pool ID
    /// @param _amount Present Value of the bid amount
    /// @param _apr APR of the bid
    /// @param _ltv LTV of the loan. Default is 0 if liquidatable isn't turned on.
  
    const getcount = contract.loans(props.poolId).then((resp)=>{
        console.log("got loan ", resp)
        setLoanInfo(resp)
    })
  
        //console.log("LOANS: ", loans)
  
      
  
  
    }, [])

 


    const bid = ()=>{
console.log("(**********")
        console.log( getValues("bidAmount"))

        console.log( getValues("bidApr"))
        console.log( getValues("bidLtv"))

        
//Approve bid
  const usdc = new ethers.Contract(USDC_ADDRESS,USDC.abi, signer)
        console.log("APROVED BID", usdc)
        usdc.approve(LAN_ADDRESS,ethers.utils.parseUnits(getValues("bidAmount"), 18)).then(()=>{
            
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

        <p></p>
        <Box boxSize='sm'>
  <Image src='https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2021%2F10%2Fbored-ape-yacht-club-nft-3-4-million-record-sothebys-metaverse-0.jpg?w=960&cbr=1&q=90&fit=max' alt='' />
</Box>

<HStack>
<TableContainer>
Bids:
    <Table>
        
    </Table>
</TableContainer>
Make a bid
<FormControl> 
<form onSubmit={handleSubmit(bid)}>
{/* This could be what exactly just 1 asset can be supplied? */}
<FormLabel as='legend'>Bid Amount</FormLabel>
<Input type="text" placeholder="420 eth" {...register("bidAmount")} />
<FormLabel as='legend'>APR</FormLabel>
<Input type="text" placeholder="69%" {...register("bidApr")} />
<FormLabel as='legend'>LTV</FormLabel>
<Input type="text" placeholder="420 eth" {...register("bidLtv")} />
<Button type="submit" >Bid</Button>
</form>
</FormControl>
</HStack>
    </div>)
  }