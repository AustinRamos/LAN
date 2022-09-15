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

import Dashboard from './components/Dashboard'
import { Link, Route, Switch, useLocation } from "react-router-dom";


import Pools from './components/Pools'
import { InfoIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import TitleBar from './components/TitleBar';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Contract from './assets/contract-info';
import Network from './assets/network-info';

import DashboardHeader from './components/DashboardHeader'

import "rari-components/assets/fonts/avenir-next/avenir.css";
import CreateLendingPool from './components/CreateLendingPool';


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
  }, []);

  const [provider, setProvider] = useState()

  useEffect(() => {
    if (isConnected) onConnect();
  }, [refreshCounter]);

  const detectCurrentProvider = () => {
    let _provider;
    if (window.ethereum) {
      _provider = window.ethereum;
      setProvider(_provider)
    } else if (window.ethereum) {

      _provider = window.ethereum
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
      window.open('https://metamask.io/');
    }
    return _provider;
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
          
          <TitleBar userInfo={userInfo} onConnect={onConnect}>
          </TitleBar>

        </Grid>

        <Container>

          <DashboardHeader></DashboardHeader>

          <Switch>
            <Route exact path="/">
              <Dashboard></Dashboard>
            </Route>

            {/* DOES THIS NEED TO WRAP ALL THE ROUTES? */}
          </Switch>
          <Route exact path="/CreatePool">
            <CreateLendingPool ></CreateLendingPool>
          </Route>
          <Route exact path="/Pools">
            <Pools ></Pools>
          </Route>
        </Container>
        <Stack spacing={8} mx={'auto'} w={['90vw', 450, 550]} py={12} px={6}>
          <Stack pt={50} align={'center'}>
          </Stack>

        </Stack>
      </Box>
    </Flex>

  );
}

export default App;