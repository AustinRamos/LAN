import {
  Flex,
 Image ,
  Box,
  Stack,
  HStack,
  Menu,
  Center,
  Button,
  MenuButton,
  Avatar,
  Tooltip,
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
import BaseBidRegistry from '../artifacts/contracts/BaseBidRegistry.sol/BaseBidRegistry.json'
import BaseBid from '../artifacts/contracts/BaseBid3.sol/BaseBid3.json'

//   import { ColorModeSwitcher } from './ColorModeSwitcher';

//   import LogoBsc from '../assets/bsc.svg';

import { useEffect, useState } from 'react'

import Logo from '../assets/logo.png';
import MetaLogo from '../assets/metamask.svg';
import AuctionInfo from '../components/AuctionInfo'
import { LAN_ADDRESS, NFT_ADDRESS, USDC_ADDRESS,BASEBIDREGISTRY_ADDRESS } from '../constants'


//process.env.LAN_ADDRESS



export default function Pools() {

const [showPool,setShowPool] = useState(false);
const [poolBidId,setPoolBidId] = useState(null);

  const [count, setCount] = useState(0)
  const [pools, setPools] = useState([])
const [poolsInfo,setPoolsInfo] = useState([])
//   const [currcontract,setContract] = useState(null)

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner()

  //************ */
   const contract = new ethers.Contract(BASEBIDREGISTRY_ADDRESS, BaseBidRegistry.abi, signer)
 
console.log ("CONTRACT: ", contract)
  useEffect(() => {


    const getcount = contract.count().then(resp => {
      console.log("COUNT GOTTEN -> ", resp.toNumber())
      setCount(resp.toNumber())
      // console.log(count)
      console.log("count dependency " , count)
      for (let i = 0; i < resp.toNumber(); i++) {
        // console.log("for loop ", i)
        //setTest([...test,i])
        
         contract.getBaseBids(i).then(resp => {

           //get current basebid contract 
     const currBaseBidContract = new ethers.Contract(resp, BaseBid.abi, signer)
currBaseBidContract.getDetails().then(resp=>{
  console.log("DETAILS ", resp)
  setPoolsInfo(poolsInfo => [...poolsInfo, resp])
})


           console.log("basebid ", resp)
           //setLoans(loans.concat(resp))
           //setLoans([...loans, resp])
           setPools(pools => [...pools, resp])
         })
       }
     
 

      //console.log("LOANS: ", loans)

    })


  }, [])



  const getdate = (timestamp)=>{
      return new Date(Math.round(timestamp*1000)).toLocaleString()
  }
  return (
  <div>

 
   <h2>         

  {/* <AuctionInfo nftAddress="" poolId={auctionId}></AuctionInfo> */}
        </h2>     
        
  
<div>
<p>Existing Pools:</p>
<Flex>

<TableContainer maxWidth="100%" size="lg">
<Table variant='striped'size="lg" maxWidth="100%">
{/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
<Thead>
<Tr>
<Th>Admin</Th>
<Th>Token</Th>
<Th> Min Apr </Th>

</Tr>
</Thead>

 <Tbody>
{poolsInfo.map(pool=>

  <Tr key = {pool[0]}>
    <Td>
      {pool[0].substring(0,7)}...
      
    </Td>
    <Td>
      USDC 
    </Td>
    <Td>
      {/* {loan[8].toNumber()} */}
    </Td>
    <Td>
      {/* {loan[5].toNumber()}% */}
    </Td>
    <Td>
     {/* {getdate(loan.time[1].toNumber())}  */}

    </Td>
    <Td>
    <Button onClick={()=>{setShowPool(true)
     setPoolBidId("test")} //address instead of id... 
     } >View</Button>
    </Td>
  </Tr>

)}

</Tbody> 

</Table>

</TableContainer>

</Flex>

    {/* Number of Auctions:
    {count}
    {     console.log("pools** ", pools)
        }
        {          console.log("count**" , count)
}
    <ul>
      
    </ul> */}
  </div>
  
  </div>)

      }

