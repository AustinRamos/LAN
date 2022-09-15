import React from 'react';
import {
  Heading,
  Flex,
  Stack,
  ChakraProvider,
  Box,
  Text,
  //Link,
  VStack,
  Code,
  Grid,
  theme,
  useDisclosure,
  useColorModeValue,
  Button,
  Container,
  Spacer,
  Center
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
import { Link, Route, Switch, useLocation } from "react-router-dom";
//  <Menu style={{ textAlign: "center", marginTop: 40 }} selectedKeys={[location.pathname]} mode="horizontal">
//         <Menu.Item key="/">
//           <Link to="/">App Home</Link>
//         </Menu.Item>
//         <Menu.Item key="/exampleui">
//           <Link to="/exampleui">ExampleUI</Link>
//         </Menu.Item>
        
//       </Menu>

//import { Card } from "@rari-components/";

import Pools from './components/Pools'

import { InfoIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import TitleBar from './components/TitleBar';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Contract from './assets/contract-info';
import Network from './assets/network-info';
//import CreateLendingPool from './components/CreateLendingPool'

import DashboardHeader from './components/DashboardHeader'

import "rari-components/assets/fonts/avenir-next/avenir.css";
import CreateLendingPool from './components/CreateLendingPool';

//import "rari-components";


let contract;
let refresh;


function App() {

  const [refreshCounter, setRefresh] = useState(0);
  const {
    isOpen: isInfo,
    onOpen: onInfo,
    onClose: onInfoClose,
  } = useDisclosure();
  
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({
    balance: 0,
    account: undefined,
    chainId: undefined,
    price: 0,
    staked: 0,
    isFilled: false,
    rate: 0,
  });


  const [value, setValue] = useState(0);

  const formatVal = val => Math.trunc(val * 100000) / 100000;



  useEffect(() => {
    function checkConnectedWallet() {
      const connected = JSON.parse(localStorage.getItem('isConnected'));
      if (connected) {
        setIsConnected(true);
        onConnect();
      }
    }
    checkConnectedWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [provider,setProvider] = useState()

  useEffect(() => {
    if (isConnected) onConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCounter]);

  const detectCurrentProvider = () => {
    let _provider;
    if (window.ethereum) {
      _provider = window.ethereum;
      setProvider(_provider)
    } else if (window.ethereum) {

      setProvider(window.web3.currentProvider)
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
      window.open('https://metamask.io/');
    }
    return provider;
  };

  const getPrice = async () => {
    try {
      const data = await fetch(
        'https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD'
      );
      const price = await data.json();
      return price.USD;
    } catch (e) {
      return 0;
    }
  };
  const changeChain = async web3 => {
    return window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          ...Network,
          chainId: web3.utils.toHex(Network.chainId),
        },
      ],
    });
  };


  const onConnect = async () => {
    clearTimeout(refresh);
    const ethTimeout = setTimeout(() => {
      window.location.reload(false);
    }, 25000);
    try {
      const currentProvider = detectCurrentProvider();
      setProvider(currentProvider)
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        if (Network.chainId !== chainId) await changeChain(web3);
        const account = userAccount[0];
        const ethBalance = web3.utils.fromWei(
          await web3.eth.getBalance(account),
          'ether'

        );

        if (!contract)
          contract = new web3.eth.Contract(Contract.abi, Contract.cnt);
        const status = await contract.methods.status().call({ from: account });
        const staked = formatVal(
          Number(web3.utils.fromWei(status.original_, 'ether'))
        );
        const rate =
          (Number(status.balance_) / Number(status.original_) / 1.2) * 100;
        const isFilled = status.filled_;

        const price = await getPrice();

        saveUserInfo(
          ethBalance,
          account,
          chainId,
          price,
          staked,
          isFilled,
          rate
        );
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      );
    }
    clearTimeout(ethTimeout);
    if (JSON.parse(localStorage.getItem('isConnected')))
      refresh = setTimeout(() => setRefresh(refreshCounter + 1), 5000);
  };


  const saveUserInfo = (
    ethBalance,
    account,
    chainId,
    price,
    staked,
    isFilled,
    rate
  ) => {
    window.localStorage.setItem('isConnected', true); //user persisted data
    const balance = formatVal(ethBalance);
    if (account !== userInfo.account) setValue(balance);
    setUserInfo({
      balance,
      account,
      chainId,
      price,
      staked,
      isFilled,
      rate,
    });
    setIsConnected(true);
  };

  return (
   
      <Flex
      
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.70', 'gray.5800')}
    >
    
      <Box textAlign="center" minW={'100vw'} overflowY="auto">
      
        <Grid h="5vh">
        
      {/* <TitleBar userInfo={userInfo} onConnect={onConnect}>

      </TitleBar> */}
      <TitleBar userInfo={userInfo} onConnect={onConnect}>
      
</TitleBar>

</Grid>


<Container>

{/* <DashboardHeader></DashboardHeader> */}

<Center >
<Grid h="17vh">
<Stack spacing={8} direction='row' align='center'>
<Link to="/borrow" key="/borrow">
<Button
              isLoading={false}
              // isDisabled={
              //   !props.isConnected ||
              //   Number(props.value) > info.balance ||
              //   Number(props.value) === 0
              // }
              //onClick={onStake}
              spinnerPlacement="start"
              loadingText="Stake"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
            >
              Borrow
            </Button>
            </Link>

            <Button
              isLoading={false}
              // isDisabled={
              //   !props.isConnected ||
              //   Number(props.value) > info.balance ||
              //   Number(props.value) === 0
              // }
              //onClick={onStake}
              spinnerPlacement="start"
              loadingText="Stake"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
            >
              Supply
            </Button>

            <Link to="/CreatePool" key="/CreatePool">
            <Button
              isLoading={false}
              // isDisabled={
              //   !props.isConnected ||
              //   Number(props.value) > info.balance ||
              //   Number(props.value) === 0
              // }
              //onClick={onStake}
              spinnerPlacement="start"
              loadingText="Stake"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
            >
              Create Lending Pool
            </Button>

                </Link>
                <Link to="/Pools" key="/Pools">
            <Button
              isLoading={false}
              // isDisabled={
              //   !props.isConnected ||
              //   Number(props.value) > info.balance ||
              //   Number(props.value) === 0
              // }
              //onClick={onStake}
              spinnerPlacement="start"
              loadingText="Stake"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
            >
              Browse Existing Pools
            </Button>
            </Link>
            <Button
              isLoading={false}
              // isDisabled={
              //   !props.isConnected ||
              //   Number(props.value) > info.balance ||
              //   Number(props.value) === 0
              // }
              //onClick={onStake}
              spinnerPlacement="start"
              loadingText="Stake"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
            >
              View Auctions
            </Button>
            </Stack>
            </Grid>
            </Center>


{/* //******************** */ }

<Switch>
        <Route exact path="/">
          {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
          
      Your Supplies:
 <Flex >


            {/* <TableContainer > */}
     
  <Table sx="sm" variant='simple'>
    {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
    <Thead>
      <Tr>
        <Th>Assets</Th>
        <Th>Balance</Th>
        <Th isNumeric>APY</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>ETH</Td>
        <Td>12.4</Td>
        <Td isNumeric>69%</Td>
        <Flex>
        <Td><Button>Supply</Button></Td>
        <Td><Button>Withdraw</Button></Td>
        </Flex>

      </Tr>
      <Tr>
        <Td>USDC</Td>
        <Td> 10000</Td>
        <Td isNumeric>420%</Td>
        <Flex>
        <Td><Button>Supply</Button></Td>
        <Td><Button>Withdraw</Button></Td>
        </Flex>
      </Tr>
     
    </Tbody>
    {/* <Tfoot>
      <Tr>
        <Th>To convert</Th>
        <Th>into</Th>
        <Th isNumeric>multiply by</Th>
      </Tr>
    </Tfoot> */}
  </Table>
  
{/* // </TableContainer> */}
</Flex>


Assets to Supply:
<Flex>


<Table variant='simple'>
{/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
<Thead>
<Tr>
<Th>Assets</Th>
<Th>Balance</Th>

</Tr>
</Thead>
<Tbody>
<Tr>
<Td>ETH</Td>
<Td>12.4</Td>

<Flex>
<Td><Button>Supply</Button></Td>

</Flex>

</Tr>
<Tr>
<Td>USDC</Td>
<Td> 10000</Td>

<Flex>
<Td><Button>Supply</Button></Td>
</Flex>
</Tr>

</Tbody>
{/* <Tfoot>
<Tr>
<Th>To convert</Th>
<Th>into</Th>
<Th isNumeric>multiply by</Th>
</Tr>
</Tfoot> */}
</Table>

</Flex>



Your Auctions:
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
  </Route>


  {/* DOES THIS NEED TO WRAP ALL THE ROUTES? */}
  </Switch>

  <Route exact path="/CreatePool">
    <CreateLendingPool ></CreateLendingPool>
  </Route>
  <Route exact path="/Pools">
  <Pools provider = {provider}></Pools>
</Route>

</Container>


      <Stack spacing={8} mx={'auto'} w={['90vw', 450, 550]} py={12} px={6}>
      
            <Stack pt={50} align={'center'}>
            
              {/* <Heading fontSize={'4xl'}>P2P and P2Pool lending</Heading>
              <Text
                fontSize={'lg'}
                color={useColorModeValue('gray.500', 'gray.600')}
              >
                <Link onClick={onInfo}>stake / earn / enjoy</Link>{' '}
                <Link onClick={onInfo}>
                  <InfoIcon /> </Link>
              </Text> */}
            </Stack>



            </Stack>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
         
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
  
     
        </Box>
        </Flex>

  );
}

export default App;
