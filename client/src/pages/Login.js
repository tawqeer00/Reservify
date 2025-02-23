import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import BASE_URL from "../env.js";

export default function Login(props) {
  const toast = useToast();
  const navigate = useNavigate();
  const loginURL = `${BASE_URL}/users/login`;
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const onChange = e => {
    const value = e.target.value;
    setCredentials({
      ...credentials,
      [e.target.name]: value,
    });
  };




  const login = e => {
    setLoading(true)
    e.preventDefault();
    axios
      .post(loginURL, credentials)
      .then(response => {
        if (response.data.token) {
          props.setLogin(response.data);

         localStorage.setItem('Reservify', JSON.stringify(response.data))
         sessionStorage.setItem('Reservify', JSON.stringify(response.data))
          

          setCredentials({ email: '', password: '' });
          setLoading(false)
          if (response.data.role === 'user') {
            navigate('/');
          } else if (response.data.role === 'admin') {
            navigate('/admin');
          } else if (response.data.role === 'guard') {
            navigate('/guard');
          }
        }

      })
      .catch(error => {
        console.log(error);
        toast({
          title: 'Error',
          description: error.response.data.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        setLoading(false)
      });
  };

  return (
    <Flex
      minH={'100vh'}
      align={'flex-start'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={8} px={6}>
        <Stack align={'center'}>

          <Text
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
          >
            RESERVIFY

          </Text>

          <Divider></Divider>

          <Heading fontSize={'2xl'} textAlign="center">
            Log in to your account
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'} textAlign="center">
            Don't have an account?{' '}
            <RouteLink to={'/register'}>
              <Link color={'blue.400'}>Click here to register</Link>
            </RouteLink>
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                required
                onChange={onChange}
                value={credentials.email}
                name="email"
                placeholder="example@email.com"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                required
                onChange={onChange}
                value={credentials.password}
                name="password"
                type="password"
                placeholder="*********"
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Checkbox >Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button
                onClick={login}
                size="lg"
                colorScheme={'whatsapp'}
                shadow="md"
                isLoading={loading}
                loadingText='Signing in...'
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
        <Flex alignItems={'center'} gap={2} justifyContent={'center'}>
          <ColorModeSwitcher />
          <Text alignItems={'center'}>Light/Dark mode</Text>
        </Flex>
      </Stack>
    </Flex>
  );
}
