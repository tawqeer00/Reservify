import React from 'react';
import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LockIcon } from '@chakra-ui/icons';
import {
  FaDonate,
  FaBarcode,
  FaUsersCog,
  FaUserPlus,
  FaRegCalendarPlus,
  FaFileInvoiceDollar,
  FaDatabase,
  FaRegListAlt,
  FaRegCalendarTimes,
} from 'react-icons/fa';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import axios from 'axios';
import BASE_URL from "../env.js";

function AdminMenu(props) {
  const navigate = useNavigate();
  const userCheck = `${BASE_URL}/users/check`;

  useEffect(() => {
    if (!props.loggedIn.token) {
      navigate('/login');
    }
    axios.get(userCheck, {
      headers: { Authorization: `Bearer ${props.loggedIn.token}` },
    })
    .then(response => {
      if (response.data.role == 'admin') {
        return
      }
      else if (response.data.role == 'user') {
        navigate('/');
      }
      else if (response.data.role == 'guard') {
        navigate('/guard')
      }
      else {
        console.log('authentication error')
        props.setLogin({});
        props.logout()
        navigate('/login');
      }
    })
  },[]);

  return (
 
    <Flex
    minH={'100vh'}
    align={'center'}
    justify={'center'}
    bg={useColorModeValue('gray.50', 'gray.800')}
    p={4}
    
  >
    <Stack spacing={6} mx={'auto'} maxW={'10xl'} py={6} px={6}>
      <Stack align={'center'} spacing={2}>
        <Heading fontSize={'4xl'} textAlign="center">
          Welcome {props.loggedIn.name_first}
        </Heading>
        <Text fontSize={'lg'} textAlign="center">
          You are logged in as Admin
        </Text>
      </Stack>

      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={6}
        width='md'
      >
        <Stack spacing={6}>
          <Flex direction={'column'} gap="4">
            <Heading size={'md'} textAlign="center">Manage Bookings</Heading>
            <Stack spacing={4}>
              <RouteLink to={'/admin/past-bookings'}>
                <Button
                  colorScheme={'blue'}
                  width="full"
                  leftIcon={<FaFileInvoiceDollar />}
                  variant="solid"
                >
                  View past bookings
                </Button>
              </RouteLink>
              <RouteLink to={'/admin/future-bookings'}>
                <Button
                  colorScheme={'blue'}
                  width="full"
                  leftIcon={<FaRegCalendarTimes />}
                  variant="solid"
                >
                  Cancel future bookings
                </Button>
              </RouteLink>
            </Stack>
          </Flex>

          <Flex direction={'column'} gap="6">
            <Heading size={'md'} textAlign="center">Manage Users</Heading>
            <Stack spacing={4}>
              <RouteLink to={'/admin/topup'}>
                <Button
                  colorScheme={'blue'}
                  width="full"
                  leftIcon={<FaDonate />}
                  variant="solid"
                >
                  Top-up
                </Button>
              </RouteLink>
              <RouteLink to={'/admin/invite'}>
                <Button
                  colorScheme={'blue'}
                  width="full"
                  leftIcon={<FaBarcode />}
                  variant="solid"
                >
                  New invite code
                </Button>
              </RouteLink>
              <RouteLink to={'/admin/manage-users'}>
                <Button
                  colorScheme={'blue'}
                  width="full"
                  leftIcon={<FaUsersCog />}
                  variant="solid"
                >
                  Manage existing users
                </Button>
              </RouteLink>
              <RouteLink to={'/admin/add-user'}>
                <Button
                  colorScheme={'blue'}
                  width="full"
                  leftIcon={<FaUserPlus />}
                  variant="solid"
                >
                  Create new user
                </Button>
              </RouteLink>
            </Stack>
          </Flex>

          <Flex direction={'column'} gap="6">
            <Heading size={'md'} textAlign="center">Maintenance</Heading>
            <Stack spacing={4}>
              <RouteLink to={'/admin/logs'}>
                <Button
                  colorScheme={'blue'}
                  width="full"
                  leftIcon={<FaRegListAlt />}
                  variant="solid"
                >
                  View logs
                </Button>
              </RouteLink>
            </Stack>
          </Flex>

          <Flex direction={'row'} alignItems="center" gap={4} pl={6}>
            <ColorModeSwitcher ml="20px" py="10px" />
            <Button
              onClick={() => {
                props.setLogin({});
                props.logout();
                navigate('/login');
              }}
              leftIcon={<LockIcon />}
              colorScheme={'red'}
              
              variant="solid"
              mr="26px"
              px="80px"
              py="2px"
            >
              Logout
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Stack>
  </Flex>
  );
}

export default AdminMenu;
