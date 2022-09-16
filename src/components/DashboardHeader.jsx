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
  
  Text,
  AvatarBadge,
  MenuList,
  useColorModeValue,
  Grid,
} from '@chakra-ui/react';

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import Logo from '../assets/logo.png';
import MetaLogo from '../assets/metamask.svg';
import { Link, Route, Switch, useLocation } from "react-router-dom";

export default function DashboardHeader(props) {
  return (
<Center >
            <Grid h="17vh">
              <Stack spacing={8} direction='row' align='center'>
                {/* <Link to="/borrow" key="/borrow">
                  <Button
                    isLoading={false}
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
                  spinnerPlacement="start"
                  loadingText="Stake"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                >
                  Supply
            </Button> */}

                <Link to="/CreateAuction" key="/CreateAuction">
                  <Button
                    isLoading={false}
                    spinnerPlacement="start"
                    loadingText="Stake"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    Create Auction
            </Button>

                </Link>
                <Link to="/Auctions" key="/Auctions">
                  <Button
                    isLoading={false}
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
                </Link>
             {/*   <Button
                  isLoading={false}
                  spinnerPlacement="start"
                  loadingText="Stake"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                >
                  View Auctions
            </Button> */}
              </Stack>
            </Grid>
          </Center> 


  )
}
