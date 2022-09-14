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
    Grid
  } from '@chakra-ui/react';
  // import Blockies from 'react-blockies';
  
  import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
  //import Jazzicon from 'react-jazzicon';

//   import { ColorModeSwitcher } from './ColorModeSwitcher';
  
//   import LogoBsc from '../assets/bsc.svg';

   import Logo from '../assets/logo.png';
   import MetaLogo from '../assets/metamask.svg';
  
  export default function DashboardHeader(props) {
    return (

<Center >
<Grid h="17vh">
<Stack spacing={8} direction='row' align='center'>
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
     

    )
}
