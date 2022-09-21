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
 useEffect(() => {

//get best bid:


    contract.loans(props.poolId).then(resp => {
      console.log("BIDNUMS GOTTEN : ", resp[8].toNumber())
      setCurrBidNum(resp[8].toNumber())
      const bidNum = resp[8].toNumber()
      //getbestBid
      contract.bids(props.poolId,resp[8].toNumber()-1).then(resp=>{
          setBestBid(bestBid)
      })

//OR currBidNum -1? 

//SO IS 0th BID not actually real right?
//lol embarrassing logic... 
//if bid=>3 show last 3 bids.
//if 2 show 2 bids.
//if 1 show 1 bid...

let val;
if (bidNum>=3){
    val=3
}else if(bidNum==2){
    val=2
}else if(bidNum==1){
    val=1;
}else{
    val=0
}
console.log("VAL*** ", val)

      for (let i = bidNum-1; i >=bidNum-val; i--) {
         
       
 
         contract.bids(props.poolId,i).then(resp => {
     
         
           //setLoans(loans.concat(resp))
           //setLoans([...loans, resp])
          // setLoans(loans => [...loans, resp])
            setBids(bids => [...bids, resp])
            console.log("bids: " , bids)
         })
        }

 

      //console.log("LOANS: ", loans)

    })


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

    Total Assets Supplied:
    




Auctions: 

<div>

<Flex>



</Flex>
</div>


</HStack>

    </div>)
  }