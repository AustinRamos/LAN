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

//   import { ColorModeSwitcher } from './ColorModeSwitcher';

//   import LogoBsc from '../assets/bsc.svg';

import { useEffect, useState } from 'react'

import Logo from '../assets/logo.png';
import MetaLogo from '../assets/metamask.svg';

import { LAN_ADDRESS, NFT_ADDRESS, USDC_ADDRESS } from '../constants'


//process.env.LAN_ADDRESS



export default function Pools() {



  //  console.log("PROVIDER: " , provider)
  const [count, setCount] = useState(0)
  const [loans, setLoans] = useState([])

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prom//pt user for account connections
  //await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner()
  const contract = new ethers.Contract(LAN_ADDRESS, LAN.abi, signer)
  // dumb way to get current timestamp?



  useEffect(() => {


    const getcount = contract.count().then(resp => {
      console.log("COUNT GOTTEN -> ", resp.toNumber())
      setCount(resp.toNumber())
      // console.log(count)
      console.log("count dependency " , count)
      for (let i = 0; i < resp.toNumber(); i++) {
        // console.log("for loop ", i)
        //setTest([...test,i])
        
         contract.loans(i).then(resp => {
  
           console.log("loan ", resp)
           //setLoans(loans.concat(resp))
           //setLoans([...loans, resp])
           setLoans(loans => [...loans, resp])
         })
       }
     
 

      //console.log("LOANS: ", loans)

    })


  }, [])

  // useEffect(()=>{
  //   console.log("count dependency " , count)
  //   for (let i = 0; i < count; i++) {
  //     // console.log("for loop ", i)
  //     //setTest([...test,i])
      
  //      contract.loans(i).then(resp => {

  //        console.log("loan ", resp)
  //        //setLoans(loans.concat(resp))
  //        //setLoans([...loans, resp])
  //        setLoans(loans => [...loans, resp])
  //      })
  //    }

  // },[count])



  //const contract = new ethers.Contract(LAN_ADDRESS, LAN.abi, signer)
  // contract.


  //so for pools show OWNER OF, TOKEN(use checks to see if eth, frax, or usdc)


  //ultimately would be great to use rari component for the way they list their pools... 
const handleClick = ()=>{
  console.log("ROW CLICKED")
}
  const getdate = (timestamp)=>{
      return new Date(Math.round(timestamp*1000)).toLocaleString()
  }
  return (
  <div>

Existing Auctions:
<Flex>

<TableContainer maxWidth="100%" size="lg">
<Table variant='striped'size="lg" maxWidth="100%">
{/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
<Thead>
<Tr>
<Th>Owner</Th>
<Th>Token</Th>
<Th> Bids </Th>
<Th> Apr </Th>
<Th> End Time </Th>
<Th> TEST</Th>
</Tr>
</Thead>

<Tbody>
{loans.map(loan=>

  <Tr onClick={handleClick()}>
    <Td>
      {loan[0].substring(0,7)}...
      
    </Td>
    <Td>
      FRAX {/* USDC Will need way to update this and check if usdc, frx, weth addy. */}
    </Td>
    <Td>
      {loan[9].toNumber()}
    </Td>
    <Td>
      {loan[5].toNumber()}
    </Td>
    <Td>
     {getdate(loan[8].toNumber())} 
    </Td>
    <Td><Button>View</Button></Td>
  </Tr>

)}{new Date().toLocaleTimeString()}

</Tbody>

</Table>

</TableContainer>

</Flex>

    Number of Auctions:
    {count}
    {     console.log("loans** ", loans)
        }
        {          console.log("count**" , count)
}
    <ul>
      {/* {
        loans.map(loan =>
               // console.log("loan in react return " , loan)
          <li key={loan[8].toNumber()}>end time: {getdate(loan[8].toNumber())}</li>

       
        )} */}
    </ul>
  </div>)



}