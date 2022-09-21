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
    Checkbox
} from '@chakra-ui/react';


import { useForm } from "react-hook-form";

import { constants, ethers } from 'ethers'
//import {hre} from 'hardhat'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import LAN from '../artifacts/contracts/mainliquidations.sol/LAN.json'
import NFT from '../artifacts/contracts/SimpleNft.sol/SimpleNft.json'
import BaseBid3 from '../artifacts/contracts/BaseBid3.sol/BaseBid3.json'
import { useEffect, useState } from 'react'

import Logo from '../assets/logo.png';
import MetaLogo from '../assets/metamask.svg';

import { LAN_ADDRESS, NFT_ADDRESS, USDC_ADDRESS,FRAX_ADDRESS,BASEBIDREGISTRY_ADDRESS,WRAPPER_ADDRESS} from '../constants'

//const hre = require("hardhat");

export default function CreatePool(props) {

    const { register, getValues, handleSubmit, formState: { errors } } = useForm();

const [currAuctionName, setCurrAuctionName] = useState("")

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    const [provider, setProvider] = useState();
    useEffect(() => {
        let provider;
        if (window.ethereum) {
            provider = window.ethereum;
            setProvider(provider)
            
        } else if (window.web3) {
            provider = window.web3.currentProvider;
            setProvider(provider)

        } else {
            console.log(
                'Non-Ethereum browser detected. You should consider trying MetaMask!'
            );
            window.open('https://metamask.io/');
        }

   

    })

   

    const getBaseAsset = (asset)=>{
        if(asset==="FRAX"){
            return FRAX_ADDRESS;
        }
        if(asset==="USDC"){
            return USDC_ADDRESS;
        }
    }
 
    async function createPool() {
        // if (typeof window.ethereum !== 'undefined') {
        //     await requestAccount()
        //     const provider = new ethers.providers.Web3Provider(window.ethereum);
        //     // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        //     // Prom//pt user for account connections
        //     //await provider.send("eth_requestAccounts", []);
        //     const signer = provider.getSigner()
        //     const contract = new ethers.Contract(LAN_ADDRESS, LAN.abi, signer)

            if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {

    // Web3 browser user detected. You can now use the provider.
    const accounts = await window.ethereum.enable();
    // const curProvider = window['ethereum'] || window.web3.currentProvider

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    console.log('accounts: ', accounts);
    console.log('provider: ', provider);

    const signer = provider.getSigner();
            

  //const BaseBid = new ethers.ContractFactory(BaseBid3.abi,accounts[0])
  const BaseBid = new ethers.ContractFactory(
    BaseBid3.abi,
    BaseBid3.bytecode,
    signer
  );


  //const BaseBid = ethers.getContractFactory("BaseBid3")
//   console.log("LONGEST TERM:",getValues("longestTerm"))
//   console.log("PROVIDER: " , provider)
    //console.log("PROVIDER: " , provider.list)
console.log(ethers.utils.formatBytes32String(signer))
  console.log(signer)
  console.log("BASEBid Contract: " , BaseBid)
  console.log("BASEBIDREGISTRY_ADDRESS ", BASEBIDREGISTRY_ADDRESS)
  console.log("account[0] ", accounts[0])
  console.log(getBaseAsset(getValues("baseAsset")))
  BaseBid.connect(signer).deploy(
BASEBIDREGISTRY_ADDRESS,
accounts[0],
getBaseAsset(getValues("baseAsset")),
getValues("baseAssetOracle"),
LAN_ADDRESS,
WRAPPER_ADDRESS,
getValues("liquidationOnly"),
20, //default value for kink...
getValues("minApr"),
getValues("longestTerm"),// getValues("longestTerm"),
getValues("adminFee"),
  ).then((resp)=>{
      console.log("BaseBid instance deployed and launched to ", resp)
  })
      




        }
    }

 
    return (<div>


        <FormControl>
            <form onSubmit={handleSubmit(createPool)}>
                {/* Will this chakra input work instead of input regular */}

                <FormLabel as='legend'>Pool Name</FormLabel>

                <Input type="text" placeholder="Pool 1" {...register("poolName")} />
                <FormLabel as='legend'>Base Asset Oracle</FormLabel>
                <Input type="text" placeholder="0x...." {...register("baseAssetOracle")} />
                
                <RadioGroup size="sm" defaultValue='USDC' {...register("baseAsset")}>
                    <HStack spacing='12px'>
                        <Radio value='USDC'  >USDC</Radio>
                             <Radio size="sm" value='FRAX' >FRAX</Radio>
                             <Radio value='WETH'  >WETH</Radio>
                    </HStack>
                </RadioGroup>

                <FormLabel as='legend'>Max Term Duration</FormLabel>
                <Select placeholder='Select Duration' {...register("longestTerm")}>
                    <option value='7'>7 days</option>
                    <option value='14'>14 days</option>
                    <option value='28'>28 days</option>
                </Select>

                <FormLabel as='legend'>Minimum APR</FormLabel>
                {/* (wrapper or nft) */}
            

                   <Input type="text" placeholder="Pool 1" {...register("minApr")} />
                <FormLabel as='legend'>admin Fee</FormLabel>
                <Input type="text" placeholder="5%" {...register("adminFee")} />

                

                 

                
                
                <Checkbox {...register("liquidationOnly")}> liquidation only?
                </Checkbox>

                
              

                {/* <VStack>
                    <HStack>
                        <FormHelperText>Address</FormHelperText>
                        <FormHelperText>LTV</FormHelperText>
                        <FormHelperText>API</FormHelperText>
                        <FormHelperText>Oracle</FormHelperText>
                    </HStack>
                    <HStack spacing='12px'>
                        {/* Register Assets 

                        <Input type="text" placeholder="0x...." {...register("poolName")} />
                        <Input type="text" placeholder="LTV" {...register("poolName")} />
                        <Input type="text" placeholder="LowestApi" {...register("poolName")} />
                        <Input type="text" placeholder="Oracle Address" {...register("poolName")} />

                    </HStack>
                    <HStack spacing='12px'>
                        {/* Register Assets  *
                        <Input type="text" placeholder="0x...." {...register("poolName")} />
                        <Input type="text" placeholder="LTV" {...register("poolName")} />
                        <Input type="text" placeholder="LowestApi" {...register("poolName")} />
                        <Input type="text" placeholder="Oracle Address" {...register("poolName")} />

                    </HStack>
                    <HStack spacing='12px'>
                        {/* Register Assets  *
                        <Input type="text" placeholder="0x...." {...register("poolName")} />
                        <Input type="text" placeholder="LTV" {...register("poolName")} />
                        <Input type="text" placeholder="LowestApi" {...register("poolName")} />
                        <Input type="text" placeholder="Oracle Address" {...register("poolName")} />

                    </HStack>
                </VStack> */}



<Flex>
                <Button type="submit" > Create Pool</Button>
                </Flex>
            </form>
        </FormControl>
    </div>
    );
}