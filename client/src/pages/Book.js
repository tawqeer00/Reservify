
import React from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Divider,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox, CheckboxGroup,
  VStack,
  HStack,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,


} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react';
import { Link as RouteLink } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SlotButton from '../components/SlotButton';
import UnSlotButton from '../components/UnSlotButton';
import { FaArrowLeft } from 'react-icons/fa';
import BASE_URL from '../env';
var array = require('lodash/array');

function Book(props) {
  const bookingURL = `${BASE_URL}/bookings`;


  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

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
        if (response.data.role === 'admin') {
          navigate('/admin');
        }
        else if (response.data.role === 'guard') {
          navigate('/guard');
        }
        else if (response.data.role === 'user') {
          return;
        }
        else {
          console.log('authentication error');
          props.setLogin({});
          props.logout();
          navigate('/login');
        }
      });
  }, []);

  const toast = useToast();
  const availabilityURL = `${BASE_URL}/bookings/check/`;
  const venuesURL = `${BASE_URL}/bookings/venues`;

  const [date, setDate] = useState(''); //used for date selection
  const [times, setTimes] = useState([]); //received available times from API
  const [selected, setSelected] = useState([]); //used for user selected times



  // loading states
  const [checkLoading, setCheckLoading] = useState(false);
  const [confirmBookLoading, setConfirmBookLoading] = useState(false);

  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [venueDescription, setVenueDescription] = useState('');

  useEffect(() => {
    axios.get(venuesURL, {
      headers: { Authorization: `Bearer ${props.loggedIn.token}` },
    })
      .then(response => {
        setVenues(response.data.venues);
      })
      .catch(error => {
        toast({
          title: 'Error',
          description: 'Unable to fetch venues.',
          status: 'error',
          duration: 1000,
          isClosable: true,
        });
      });
  }, [props.loggedIn.token, toast]);

  const onDateChange = e => {
    setDate(e.target.value);
    setTimes([]);
    setSelected([]);
  };

  const onVenueChange = e => {
    const selectedVenue = venues.find(venue => venue._id === e.target.value);
    setSelectedVenue(selectedVenue._id);
    setVenueDescription(`Name: ${selectedVenue.name}, Address: ${selectedVenue.address}, Capacity: ${selectedVenue.capacity}`);
  };

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const totalAmount = selected.reduce((total, slot) => {
      return total + slot.price;
    }, 0);
    setTotalPrice(totalAmount);
  }, [selected, times, date]);





  // New state for participants
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredParticipants = participants.filter(participant =>
    participant.name_first.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch participants from the backend
  useEffect(() => {
    if (selectedVenue) {
      axios.get(`${BASE_URL}/bookings/participants`, {
        headers: { Authorization: `Bearer ${props.loggedIn.token}` },
      })
        .then(response => {
          console.log("Participants fetched:", response.data.participants);
          setParticipants(response.data.participants);
        })
        .catch(error => {
          toast({
            title: 'Error',
            description: 'Unable to fetch participants.',
            status: 'error',
            duration: 1000,
            isClosable: true,
          });
        });
    }
  }, [selectedVenue, props.loggedIn.token, toast]);







  const checkAvailability = async e => {
    setCheckLoading(true);
    setTimes([]);
    setSelected([]);
    await axios
      .get(`${availabilityURL}${date}/${selectedVenue}`,
        { headers: { Authorization: `Bearer ${props.loggedIn.token}` }, })
      .then(response => {
        setTimes(response.data.times);
        setCheckLoading(false);
      })
      .catch(error => {
        setTimes([]);
        toast({
          title: 'Error',
          description: error.response.data.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        setCheckLoading(false);
      });
  };


  const select = e => {
    const selectedId = Number(e.target.id); // Convert id to a number for comparison
    console.log("Selected slot ID:", selectedId);
    console.log("Available times:", times);

    let slotObj = times.find(time => {
      console.log(`Comparing ${Number(time.value)} with ${selectedId}`);
      return Number(time.value) === selectedId;
    });

    if (!slotObj) {
      console.error("Selected slot not found in available times.");
      return;
    }

    let newTimes = times.filter(time => Number(time.value) !== selectedId);
    let newSelected = [...selected, slotObj];
    newSelected.sort((a, b) => (a.value > b.value ? 1 : -1));
    setSelected(newSelected);
    setTimes(newTimes);
  };


  const unselect = e => {
    const selectedId = Number(e.target.id); // Convert id to a number for comparison
    console.log("Unselecting slot ID:", selectedId);
    console.log("Currently selected times:", selected);

    let slotObj = selected.find(time => Number(time.value) === selectedId);

    if (!slotObj) {
      console.error("Selected slot not found in selected times.");
      return;
    }

    let newTimes = [...times, slotObj];
    newTimes.sort((a, b) => (a.value > b.value ? 1 : -1));

    let newSelected = selected.filter(time => Number(time.value) !== selectedId);

    setSelected(newSelected);
    setTimes(newTimes);
  };


  const checkSlots = () => {
    if (selected.length < 1) {
      toast({
        title: 'Booking error',
        description:
          'Bookings must be at least 1 hour long. Please select at least 2 consecutive slots and retry.',
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
      return;
    }
    for (let i = 1; i < selected.length; i++) {
      if (selected[i].value - selected[i - 1].value !== 0.5) {
        toast({
          title: `Error on slot "${selected[i].time}"`,
          description: `A booking must have consecutive time slots. If you need to book non consecutive times, you may do so in a separate booking`,
          status: 'error',
          duration: 8000,
          isClosable: true,
        });
        return;
      }
    }
    onOpen();
  };

  const submitBooking = async () => {
    setConfirmBookLoading(true);
    await axios
      .post(
        bookingURL,
        { date: date, slots: selected, venue: selectedVenue, participants: selectedParticipants }, // Add selected participants,
        { headers: { Authorization: `Bearer ${props.loggedIn.token}` } }
      )
      .then(response => {
        props.updateBalance();
        onClose();
        toast({
          title: 'Booking Confirmed',
          description: `Your booking has been confirmed. Your remaining balance is ${response.data.remainingBalance}.`,
          status: 'success',
          duration: 8000,
          isClosable: true,
        });
        setConfirmBookLoading(false);
        checkAvailability();
      })
      .catch(err => {
        toast({
          title: 'Booking error',
          description: err.response.data.message,
          status: 'error',
          duration: 8000,
          isClosable: true,
        });
        setConfirmBookLoading(false);
      });
  };

  return (
    <>
      <Flex
        minH={'100vh'}
        align={'flex-start'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={4} mx={'auto'} maxW={'lg'} py={4} px={4} w="full">
          <RouteLink to={'/'}>
            <Button size="sm" colorScheme={'blue'} leftIcon={<FaArrowLeft />}>
              Back to menu
            </Button>
          </RouteLink>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>New booking</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              Select details to continue
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >


<Stack spacing={4}>
              <FormControl id="venue">
                <FormLabel fontSize="lg" >Select Venue</FormLabel>
                <Select placeholder="Select venue" 
                onChange={onVenueChange}
                borderColor="teal.400"
                focusBorderColor="teal.600"
                bg={useColorModeValue('white', 'gray.700')}
                _hover={{ borderColor: 'teal.500' }}
                _focus={{ borderColor: 'teal.600' }}
                shadow="md"
                rounded="md"

                >
                  {venues.map(venue => (
                    <option key={venue._id} value={venue._id}>{venue.name}</option>
                  ))}
                </Select>
              </FormControl>






        
        {/* Add Participants Button */}
        <Button colorScheme='teal' onClick={onModalOpen} mt={3} p={6} fontSize="large">
          Select Participants
        </Button>





 {/* Modal for displaying participants */}

<Modal isOpen={isModalOpen} onClose={onModalClose} size="xl">
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Select Participants</ModalHeader>
    <ModalCloseButton />
    <ModalBody overflowY="auto" maxHeight="400px">
      
      {/* Legend for Role Colors */}
      <Box mb={4} p={3} bg="gray.100" borderRadius="md">
        <Text fontSize="md" fontWeight="bold" mb={2}>
          Role Colors:
        </Text>





        <Stack direction="row" spacing={4}>
          <Box bg="blue.100" p={2} borderRadius="md" w="fit-content">
            University Staff
          </Box>
          <Box bg="green.100" p={2} borderRadius="md" w="fit-content">
            Head of Departments
          </Box>
        </Stack>
      </Box>

      <Box mb={4}>
            <Input
              placeholder="Search Participants"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </Box>

      {/* Participants Table */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Select</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredParticipants.map(participant => (
            <Tr
              key={participant._id}
              bgColor={
                participant.role === 'guard' 
                  ? 'blue.100'  // Light blue for guards
                  : 'green.100' // Light green for users
              }
            >
              <Td>{participant.name_first}</Td>
              <Td>
                <Checkbox
                  borderColor="blackAlpha.800"
                  isChecked={selectedParticipants.includes(participant._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedParticipants([...selectedParticipants, participant._id]);
                    } else {
                      setSelectedParticipants(selectedParticipants.filter(id => id !== participant._id));
                    }
                  }}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ModalBody>
    <ModalFooter>
      <Button variant="outline" mr={3} onClick={onModalClose}>
        Close
      </Button>
      <Button colorScheme="blue" onClick={onModalClose}>
        Save Selection
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>



<FormControl id="date" mb={4}>
  <FormLabel fontSize="lg" >
    Select Date
  </FormLabel>
  <Input
    onChange={onDateChange}
    size="md"
    type="date"
    required
    name="date"
    borderColor="teal.400"
    focusBorderColor="teal.600"
    bg={useColorModeValue('white', 'gray.700')}
    _hover={{ borderColor: 'teal.500' }}
    _focus={{ borderColor: 'teal.600' }}
    shadow="md"
    rounded="md"
    p={2}
  />
</FormControl>

              <Button
                colorScheme={'blue'}
                size={'lg'}
                onClick={checkAvailability}
                loadingText="Checking availability..."
                isLoading={checkLoading}
              >
                Check availability
              </Button>
              <Divider />

              <Flex justifyContent={'space-evenly'}>
                <Flex
                  maxH={400}
                  gap={0}
                  direction={'column'}
                  minWidth={'130px'}
                  overflow={'auto'}
                  alignItems="center"
                  shadow={'inner'}
                  p={2}
                >
                  <Text>Available</Text>
                  <Text fontSize={'smaller'}>(Click to select)</Text>
                  {times.map(slot => {
                    return (
                      <Flex key={slot.time}>
                        <SlotButton slot={slot} select={select} />
                      </Flex>
                    );
                  })}
                </Flex>
                <Divider orientation="vertical" />

                <Flex
                  maxH={400}
                  gap={0}
                  direction={'column'}
                  minWidth={'130px'}
                  overflow={'auto'}
                  alignItems="center"
                  shadow={'inner'}
                  p={2}
                >
                  <Text>Selected</Text>
                  <Text fontSize={'smaller'}>(Click to remove)</Text>
                  {selected.map(slot => {
                    return (
                      <Flex key={slot.time} justifyContent="center">
                        <UnSlotButton slot={slot} unselect={unselect} />
                      </Flex>
                    );
                  })}
                </Flex>
              </Flex>


              <Button colorScheme={'blue'} size={'lg'} onClick={checkSlots} >
                <Text >Book</Text>
              </Button>
            </Stack>
          </Box>
        </Stack>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Confirm your booking</DrawerHeader>

            <DrawerBody justifyContent={'space-evenly'}>
              <Flex direction={'column'} gap={6}>
                <Box>
                  <Text fontWeight={600} fontSize="lg">
                    Venue:
                  </Text>
                  <Text>{venueDescription}</Text>
                </Box>


                <Box>
                  <Text fontWeight={600} fontSize="lg">
                    Participants:
                  </Text>
                  <HStack align="start" spacing={4} wrap="wrap">
                    {selectedParticipants.map(participantId => {
                      const participant = participants.find(p => p._id === participantId);
                      return participant ? (
                        <Text key={participant._id}>{participant.name_first}</Text>
                      ) : null;
                    })}
                  </HStack>
                </Box>



                <Box>
                  <Text fontWeight={600} fontSize="lg">
                    Date:
                  </Text>
                  <Text>{date}</Text>
                </Box>

                <Box>
                  <Text fontWeight={600} fontSize="lg">
                    Selected time slots:
                  </Text>
                  {selected.map(slot => {
                    return (
                      <div key={slot.value}>
                        <Text>{slot.time} (+ 30 mins)</Text>
                      </div>
                    );
                  })}
                </Box>
                <Box>
                  <Text fontWeight={600} fontSize="lg">
                    Total duration:
                  </Text>
                  {`${selected.length / 2} hour/s`}
                </Box>
                <Box>
                  <Divider mt={2} mb={2} />

                  <Flex alignItems="center" justifyContent={'space-evenly'}>
                    <Text fontWeight={600} fontSize="lg">
                      Total price:
                    </Text>
                    <Text>{totalPrice}</Text>
                  </Flex>
                  <Divider mt={2} mb={2} />
                </Box>
              </Flex>
            </DrawerBody>

            <DrawerFooter justifyContent={'space-evenly'}>
              <Button
                colorScheme={'red'}
                mr={3}
                onClick={onClose}
                size="lg"
                isDisabled={confirmBookLoading}
              >
                X Cancel
              </Button>
              <Button
                colorScheme="green"
                size={'lg'}
                onClick={submitBooking}
                loadingText="Processing..."
                isLoading={confirmBookLoading}
              >
                Confirm & Pay
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex>
    </>
  );
}

export default Book;

