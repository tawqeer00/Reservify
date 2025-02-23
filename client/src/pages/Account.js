import {
  Flex,
  Text,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useToast,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link as RouteLink } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '../components/Loader';
import EmailDrawer from '../components/EmailDrawer';
import PasswordDrawer from '../components/PasswordDrawer';
import AccountDeleteDrawer from '../components/AccountDeleteDrawer';
import LogsDrawer from '../components/LogsDrawer';
import BASE_URL from "../env";
export default function Account(props) {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    isOpen: isLogsOpen,
    onOpen: onLogsOpen,
    onClose: onLogsClose,
  } = useDisclosure();
  const {
    isOpen: isEmailOpen,
    onOpen: onEmailOpen,
    onClose: onEmailClose,
  } = useDisclosure();
  const {
    isOpen: isPassOpen,
    onOpen: onPassOpen,
    onClose: onPassClose,
  } = useDisclosure();
  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onClose: onDelClose,
  } = useDisclosure();

  const userCheck = `${BASE_URL}/users/check`;
  const userInfoURL = `${BASE_URL}/users/user/${props.loggedIn.id}`;
  const [loading, setLoading] = useState({
    email: false,
    logs: false,
    password: false,
    delete: false,
  });

  useEffect(() => {
    if (!props.loggedIn.token) {
      console.log(props.loggedIn.token); 
      navigate('/login');
    }
    axios
      .get(userCheck, {
        headers: { Authorization: `Bearer ${props.loggedIn.token}` },
      })
      .then(response => {
        if (response.data.role == 'admin') {
          navigate('/admin');
        } else if (response.data.role == 'guard') {
          navigate('/guard');
        } else if (response.data.role == 'user') {
          axios
            .get(userInfoURL, {
              headers: { Authorization: `Bearer ${props.loggedIn.token}` },
            })
            .then(response => {
              setUserInfo(response.data.userInfo);
              setEmail(response.data.userInfo.email);
            });
          return;
        } else {
          console.log('authentication error');
          props.setLogin({});
          props.logout();
          navigate('/login');
        }
      });
  }, []);

  const [userInfo, setUserInfo] = useState({
    name_first: '',
    name_last: '',
    email: '',
    department: '',
    balance: 0,
  });

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState({ password: '', confirmPass: '' });
  const [logDuration, setLogDuration] = useState('');
  const [logs, setLogs] = useState([]);

  const onPassChange = e => {
    const value = e.target.value;
    setPass({
      ...pass,
      [e.target.name]: value,
    });
  };

  const onRegChange = e => {
    const value = e.target.value;
    setEmail(value);
  };

  const emailUpdate = () => {
    if (email == userInfo.email) {
      toast({
        title: 'No change',
        description: 'Please enter a new email address and try again.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    onEmailOpen();
  };

  const submitEmailUpdate = () => {
    if (email != userInfo.email) {
      setLoading({ ...loading, email: true });
      const updateURL = `${BASE_URL}/users/update`;
      axios
        .put(
          updateURL,
          { email: email },
          {
            headers: { Authorization: `Bearer ${props.loggedIn.token}` },
          }
        )
        .then(response => {
          console.log(response.data);
          if (response.data.message == 'updated') {
            setUserInfo({ ...userInfo, email: email });
            toast({
              title: 'Email updated',
              description: `Email address updated to ${email}`,
              status: 'success',
              duration: 2000,
              isClosable: true,
            });
            setLoading({ ...loading, email: false });
            onEmailClose();
          } else {
            toast({
              title: 'Email update',
              description: `Email did not update. Please try again.`,
              status: 'error',
              duration: 2000,
              isClosable: true,
            });
            setLoading({ ...loading, email: false });
          }
        })
        .catch(err => {
          toast({
            title: 'Email update failed',
            description: err.response.data.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        });
    }
  };

  const submitPass = () => {
    if (pass.password != pass.confirmPass) {
      toast({
        title: 'Password change',
        description: `Passwords Don't match.`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (pass.password.length < 8) {
      toast({
        title: 'Password change',
        description: `Password is too short.`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setLoading({ ...loading, password: true });
    const updateURL = `${BASE_URL}/users/update`;
    axios
      .put(updateURL, pass, {
        headers: { Authorization: `Bearer ${props.loggedIn.token}` },
      })
      .then(response => {
        console.log(response);
        if (response.data.message == 'updated') {
          toast({
            title: 'Password updated',
            description: `Your account password has been changed.`,
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        }
        setLoading({ ...loading, password: false });
        setPass({ password: '', confirmPass: '' });
        onPassClose();
      })
      .catch(err => {
        toast({
          title: 'Password update failed',
          description: err.response.data.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        setLoading({ ...loading, password: false });
      });
  };

  const onDurChange = e => {
    setLogDuration(e.target.value);
  };

  const delAccount = () => {
    setLoading({ ...loading, delete: true });
    const deleteURL = `${BASE_URL}/users/delete/${props.loggedIn.id}`;
    axios
      .delete(deleteURL, {
        headers: { Authorization: `Bearer ${props.loggedIn.token}` },
      })
      .then(response => {
        console.log(props.loggedIn.id);
        if (response.data.message == 'deleted') {
          props.setLogin({});
          props.logout();
          
          navigate('/login');
        }
        setLoading({ ...loading, delete: false });
      })
      .catch(err => {
        console.log(props.loggedIn.id);
        toast({
          title: 'Account deletion failed',
          description: err.response.data.message,
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
        setLoading({ ...loading, delete: false });
      });
  };

 const fetchLogs = () => {
    setLoading({ ...loading, logs: true });
    const logsURL = `${BASE_URL}/users/logs/${logDuration}`;
    axios
      .get(logsURL, {
        headers: { Authorization: `Bearer ${props.loggedIn.token}` },
      })
      .then(response => {
        console.log(response.data.logs);
        setLogs(response.data.logs);
        setLoading({ ...loading, logs: false });
      })
      .catch(err => {
        toast({
          title: 'View Activity failed',
          description: err.response.data.message,
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
        setLoading({ ...loading, logs: false });
      });
  };

  if (!userInfo.email) {
    return <Loader />;
  }

  return (
    <Flex minH={'100vh'} align={'flex-start'} justify={'center'}>
      <Stack spacing={4} mx={'auto'} maxW={'lg'} py={4} px={4} w="full">
        <RouteLink to={'/'}>
          <Button size="sm" colorScheme={'blue'} leftIcon={<FaArrowLeft />}>
            Back to menu
          </Button>
        </RouteLink>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            My account
          </Heading>
        </Stack>
        <Box rounded={'lg'} boxShadow={'lg'} p={8}>
          <Stack spacing={4}>
            <Heading fontSize={'large'}>
              Account Balance : {userInfo.balance}
            </Heading>
            <Divider />
            <Flex>
              <Text fontWeight={'bold'}>Name: </Text>
              <Text>
                {' '}
                {userInfo.name_first} {userInfo.name_last}
              </Text>
            </Flex>
            <Flex>
              <Text fontWeight={'bold'}>Dapartment: </Text>
              <Text> {userInfo.address}</Text>
            </Flex>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                required
                shadow={'inner'}
                onChange={onRegChange}
                value={email}
                name="email"
                type="email"
                placeholder="example@email.com"
              />
            </FormControl>
            <Stack spacing={4} pt={2}>
              <Button onClick={emailUpdate} colorScheme={'blue'}>
                Update email
              </Button>
              <Divider />
              <Flex flexDirection={'column'} gap="2">
                <Button onClick={onLogsOpen} colorScheme={'blue'}>
                  View my activity
                </Button>
                <Button onClick={onPassOpen} colorScheme={'blue'}>
                  Change password
                </Button>
                <Divider mt={2} />
                <Button
                  onClick={onDelOpen}
                  size="sm"
                  colorScheme={'red'}
                  mt="2"
                >
                  Delete my account
                </Button>
              </Flex>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      {/* Logs Drawer */}
      <LogsDrawer
        isLogsOpen={isLogsOpen}
        onLogsClose={onLogsClose}
        logs={loading.logs}
        _logs={logs}
        onDurChange={onDurChange}
        fetchLogs={fetchLogs}
      ></LogsDrawer>
      <EmailDrawer
        isEmailOpen={isEmailOpen}
        onEmailClose={onEmailClose}
        loading={loading}
        email={userInfo.email}
        _email={email}
        submitEmailUpdate={submitEmailUpdate}
      ></EmailDrawer>
      {/* Password Drawer */}
      <PasswordDrawer
        isPassOpen={isPassOpen}
        onPassClose={onPassClose}
        loading={loading}
        pass={pass}
        setPass={setPass}
        onPassChange={onPassChange}
        submitPass={submitPass}
      ></PasswordDrawer>
      {/* Delete Account Drawer */}
      <AccountDeleteDrawer
        isDelOpen={isDelOpen}
        onDelClose={onDelClose}
        loading={loading}
        delAccount={delAccount}
      ></AccountDeleteDrawer>
    </Flex>
  );
}
