
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
  import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

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

 export default function Dashboard(props) {


    return (
    <div>
      My Auctions:



       
     


<Flex>

<TableContainer>
<Table variant='simple'>
{/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
<Thead>
<Tr>
<Th>Auction</Th>
<Th>Borrowed Asset</Th>
<Th> Bid </Th>
<Th> Accrued Interest </Th>
<Th> Apr </Th>
<Th> Expiry Status </Th>



</Tr>
</Thead>


</Table>
</TableContainer>

</Flex>

    </div>
    )
 }