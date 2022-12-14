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
import NFT from '../artifacts/contracts/SimpleNft.sol/SimpleNft.json'
import BaseBidRegistry from '../artifacts/contracts/BaseBidRegistry.sol/BaseBidRegistry.json'
import USDC from '../artifacts/contracts/USDC.sol/USDC.json'

import { useEffect, useState } from 'react'
import BaseBid3 from '../artifacts/contracts/BaseBid3.sol/BaseBid3.json'



import Logo from '../assets/logo.png';
import MetaLogo from '../assets/metamask.svg';

import { LAN_ADDRESS, NFT_ADDRESS, USDC_ADDRESS,FRAX_ADDRESS,BASEBIDREGISTRY_ADDRESS } from '../constants'

export default function CreateAuction(props) {

    const { register, getValues, handleSubmit, formState: { errors } } = useForm();

const [currAuctionName, setCurrAuctionName] = useState("")
const [AuctionCreate,setAuctionCreate] = useState(false)
const [value,setValue] = useState("")
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

         
           


           
            //Approve NFT TRANSFER TO CONTRACT
  const nft_contract = new ethers.Contract(NFT_ADDRESS,NFT.abi, signer)
        //(address owner, address approved, uint256 tokenId)

        //is signer correct?
        //also remember to compile and add nft to 
        //and next change metadata uri to show actual nft's!
        console.log("NFTOWNER= ", signer)
        console.log("PROVIDER: " , provider)
        nft_contract.connect(signer).approve(LAN_ADDRESS,getValues("nftId")).then(()=>{
            console.log("NFT SUCCESFULLY APPROVED, SHOULD BE SENT NOW")
                  //ideally the contract would emit an event bid rejected r bid accepted
            

            const start_time = Math.round((Date.now() / 1000) + 500)


                const end_time= start_time+(86400*parseInt(getValues("auctionDuration")))
            console.log("USDC ERROR : ", USDC_ADDRESS)
            console.log("NEW START TIME", start_time)


console.log("COLLECTION ADDRESSS************************" ,  getValues("collectionAddress"))
console.log("LAN CONTRACT: " , contract)
console.log("LAN CONTRACT: " , contract)
console.log("LAN CONTRACT: " , contract)

const baseAssetAddress = USDC_ADDRESS

             contract.connect(signer).launch(
                USDC_ADDRESS,// getValues("operatorAddress"), ARBITRARY DDRESS NO OPERATOR
                getBaseAsset(getValues("baseAsset")),
                USDC_ADDRESS,// arbiitrary address... no oracle getValues("oracleAddress"), //oracle address
                 getValues("collectionAddress"), 
                getValues("nftId"), //nft_id 
                start_time,
                end_time,
                getValues("liquidatable"),
                getValues("whitelisted")
            ).then(()=>{
                console.log("auction created ")
                setAuctionCreate(true)


                //HAVE TO MAKE it CALL BASEBID 3... think about how?
                //so sort of simple, has to call basebidregistry get count=0...
            //     const basebidRegistry = new ethers.Contract(BASEBIDREGISTRY_ADDRESS,BaseBidRegistry.abi, signer)
            //     basebidRegistry.getBaseBids(0).then((resp)=>{
            //                 console.log("BASEBIDPOOL: " , resp)

            //             const basebidcontract =  new ethers.Contract(resp,BaseBid3.abi, signer)
            //             basebidcontract.bid(0) //should be pool id...
            //     })
            // })



        //     const contract1=new ethers.Contract(LAN_ADDRESS, LAN.abi, newsigner)
        //         //lol: just for demo: 
        //         const usdcapproval = new ethers.Contract(USDC_ADDRESS,USDC.abi,newsigner)
               
        // usdcapproval.approve(LAN_ADDRESS,ethers.utils.parseUnits("25000", 18)).then(()=>{
        //             console.log("USDC APPROVED FOR FIRST BID")
        //         contract1.bid(0, ethers.utils.parseUnits("25000", 18),20,0).then(resp=>{
        //             console.log("BID Auto made on auction launch")
        //         })
        // })

            })
        })


      
    //launch auction
// console.log("COLLECTION ADDRESSS************************" ,  getValues("collectionAddress"))
// const baseAssetAddress = USDC_ADDRESS
//             const transaction = await contract.connect(signer).launch(
//                 getValues("operatorAddress"),
//                 getBaseAsset(getValues("baseAsset")),
//                 getValues("collectionAddress"), //address of nft wrapped?
//                 ethers.constants.AddressZero, //oracle address
//                 getValues("nftId"), //nft_id 
//                 start_time + 600,
//                 end_time,
//                 getValues("liquidatable"),
//                 getValues("whitelisted")
//             )

           // await transaction.wait()
        }
    }
    return (<div>




        <FormControl>
            <form onSubmit={handleSubmit(createPool)}>
                {/* Will this chakra input work instead of input regular */}

                {/* <FormLabel as='legend'>Auction Name</FormLabel>

                <Input type="text" placeholder="Auction 1" {...register("auctionName")} /> */}
                <FormLabel as='legend'>Base Asset</FormLabel>
                
                <RadioGroup size="sm" defaultValue='USDC' >
                    <HStack spacing='12px'>
                        <Radio value='USDC'  {...register("baseAsset")}>USDC</Radio>
                             <Radio  value='FRAX' {...register("baseAsset")}>FRAX</Radio>
                             <Radio value='WETH' {...register("baseAsset")} >WETH</Radio>
                    </HStack>
                </RadioGroup>

                {/* <FormLabel as='legend'>Operator</FormLabel>
                <Input type="text" placeholder="0x...." {...register("operatorAddress")} /> */}

                <FormLabel as='legend'>Max Auction Duration</FormLabel>
                <Select placeholder='Select Duration' {...register("auctionDuration")}>
                    <option value='7'>7 days</option>
                    <option value='14'>14 days</option>
                    <option value='28'>28 days</option>
                </Select>

                {/* <FormLabel as='legend'>Oracle Address</FormLabel>
                {/* (wrapper or nft) */}
                {/* <Input type="text" placeholder="0x...." {...register("oracleAddress")} /> */} 

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
                <Button type="submit" > Create Auction</Button>
                </Flex>
            </form>
        </FormControl>
    </div>
    );
}