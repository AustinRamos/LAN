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

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import LAN from '../artifacts/contracts/mainliquidations.sol/LAN.json'

import { useEffect, useState } from 'react'

import Logo from '../assets/logo.png';
import MetaLogo from '../assets/metamask.svg';

import { LAN_ADDRESS, NFT_ADDRESS, USDC_ADDRESS,FRAX_ADDRESS } from '../constants'

export default function CreateAuction(props) {

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

    //should really store provider with usestate... 
    useEffect(()=>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const contract = new ethers.Contract(LAN_ADDRESS, LAN.abi, signer)
     
        contract.on("newPool",(count, _collectionAddress, _nftId)=>{
            console.log("**************************NEWPOOLCREATED***********")
            console.log(count)
            console.log(_collectionAddress)
            console.log(_nftId)
        })
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
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            // Prom//pt user for account connections
            //await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(LAN_ADDRESS, LAN.abi, signer)

            console.log("TEST VALS ", getValues())
         
            const timestamp = (await provider.getBlock("latest")).timestamp;

         
            //will need a date thing for that
            const start_time = Math.round(Date.now() / 1000)
                const end_time= start_time+(86400*parseInt(getValues("auctionDuration")))
            console.log("NEW START TIME", start_time)
      
            /// @param _operator, EOA or normal Contract. Can act on behalf of owner to rollover a loan. Set address(0) if not used
    /// @param _token, base borrowable asset, only one per loan.
    /// @param _oracleAddress, address for the collection address asset. Default is ChainlinkOracle.sol Requires liquidatable = true
    /// @param _collectionAddress, address for the Wrapper NFT, although this could be literally any NFT
    /// @param _nftId, nftId
    /// @param _startTime, the startTime of the loan in blocks
    /// @param _endTime, the endTime of the loan in blocks
    /// @param _liquidatable, if the loan can be liquidatable
    /// @param _whitelisted, if the loan is whitelisted to only approved bidders

            const transaction = await contract.connect(signer).launch(
                getValues("operatorAddress"),
                getBaseAsset(getValues("baseAsset")),
                getValues("collectionAddress"), //address of nft wrapped?
                ethers.constants.AddressZero, //oracle address
                getValues("nftId"), //nft_id 
                start_time + 600,
                end_time,
                getValues("liquidatable"),
                getValues("whitelisted")
            )

            await transaction.wait()
        }
    }
    return (<div>


{/* 
address _operator, 
        address _token,  
        address _oracleAddress,
        address _collectionAddress,
        uint256 _nftId, 
        uint256 _startTime, 
        uint256 _endTime, 
        bool _liquidatable,
        bool _whitelisted) */}

        <FormControl>
            <form onSubmit={handleSubmit(createPool)}>
                {/* Will this chakra input work instead of input regular */}

                <FormLabel as='legend'>Auction Name</FormLabel>

                <Input type="text" placeholder="Auction 1" {...register("auctionName")} />
                <FormLabel as='legend'>Base Asset</FormLabel>
                <RadioGroup size="sm" defaultValue='FRAX' {...register("baseAsset")}>
                    <HStack spacing='12px'>
                        <Radio size="sm" value='FRAX' {...register("baseAsset")}>FRAX</Radio>
                        <Radio value='WETH' {...register("baseAsset")} >WETH</Radio>
                        <Radio value='USDC' {...register("baseAsset")} >USDC</Radio>
                    </HStack>
                </RadioGroup>

                <FormLabel as='legend'>Operator</FormLabel>
                <Input type="text" placeholder="0x...." {...register("operatorAddress")} />

                <FormLabel as='legend'>Max Auction Duration</FormLabel>
                <Select placeholder='Select Duration' {...register("auctionDuration")}>
                    <option value='7'>7 days</option>
                    <option value='14'>14 days</option>
                    <option value='28'>28 days</option>
                </Select>

                <FormLabel as='legend'>Oracle Address</FormLabel>
                {/* (wrapper or nft) */}
                <Input type="text" placeholder="0x...." {...register("oracleAddress")} />

                <FormLabel as='legend'>Collection Address</FormLabel>
                <Input type="text" placeholder="0x...." {...register("collectionAddress")} />

                <FormLabel as='legend'>NFT ID </FormLabel>
                <Input type="text" placeholder="0x...." {...register("nftId")} />

                
                <Checkbox {...register("liquidatable")}> liquidatable
                </Checkbox>

                <Checkbox {...register("whitelisted")}> whitelisted
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