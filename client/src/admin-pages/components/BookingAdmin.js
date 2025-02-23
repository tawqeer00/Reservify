import React from 'react';
import {
  Box,
  useColorModeValue,
  Flex,
  Text,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  FormLabel,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import BASE_URL from "../../env";

function BookingAdmin(props) {
  const [color, setColor] = useState('');
  useEffect(() => {
    switch (props.booking.status) {
      case 'confirmed':
        setColor('green');
        break;

      case 'completed':
        setColor('blue');
        break;
    }
  } ,[props.booking.status]);
  const toast = useToast();
  const cancelURL = `${BASE_URL}/admin/bookings/cancel`;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [cancelLoading, setCancelLoading] = useState(false);

  const [reason, setReason] = useState('');


  const cancelBooking = () => {
    setCancelLoading(true);
    axios
      .put(
        cancelURL,
        { ...props.booking, reason: reason },
        {
          headers: { Authorization: `Bearer ${props.loggedIn.token}` },
        }
      )
      .then(response => {
        props.updateBookings();
        onClose();
        toast({
          title: 'Booking cancelled',
          description: response.data.message,
          status: 'success',
          duration: 8000,
          isClosable: true,
        });
        setCancelLoading(false);
      })
      .catch(err => {
        toast({
          title: 'Cancellation failed',
          description: err.message,
          status: 'error',
          duration: 8000,
          isClosable: true,
        });
        setCancelLoading(false);
      });
  };

  const onReasonChange = e => {
    setReason(e.target.value);

  };
  return (
    <Flex w={'full'}>
      <Flex
        rounded={'lg'}
        bg={useColorModeValue(`${color}.50`, `${color}.700`)}
        boxShadow={'md'}
        p={2}
        w="full"
        justifyContent={'space-between'}
        flexDirection={'column'}
        gap={2}
      >
        <Flex flexDirection={'column'}>
        <Text>
            <strong>Venue:</strong>
            {props.booking.venue ? ` ${props.booking.venue.name}` : ' Venue not available'}
          </Text>
          <Text>
            <strong>Date:</strong>
            {` ${props.booking.day}/${props.booking.month}/${props.booking.year}`}


          </Text>
          <Text>            <strong>Duration:</strong>
            {` ${props.booking.slots.length / 2} hour/s`}</Text>

          <Text>
            <strong>Time slots:</strong>
          </Text>
          <Flex gap={2} wrap="wrap">
            {props.booking.slots_full.map(time => {
              return <Text key={time.time}>{time.time}</Text>;
            })}
          </Flex>
          <Text>
            <strong>Status:</strong>
            {` ${props.booking.status}`}
          </Text>
        </Flex>
        <Divider />
        <Flex justifyContent={'flex-end'} alignItems={'center'} w="full">
          <Button colorScheme={'red'} size={'sm'} onClick={onOpen}>
            Cancel this booking
          </Button>
        </Flex>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Confirm cancellation</DrawerHeader>

          <DrawerBody justifyContent={'space-evenly'}>
            <Flex direction={'column'} gap={6}>
              <Box>

                <Text fontWeight={600} fontSize="lg">
                  Date:
                </Text>
                <Text>{` ${props.booking.day}/${props.booking.month}/${props.booking.year}`}</Text>
              </Box>

              <Box>
                <Text fontWeight={600} fontSize="lg">
                  Time slots:
                </Text>
                {props.booking.slots_full.map(time => {
                  return <Text key={time.time}>{time.time}</Text>;
                })}
              </Box>
              <Box>
                <Text fontWeight={600} fontSize="lg">
                  Total duration:
                </Text>
                {` ${props.booking.slots.length / 2} hour/s`}
              </Box>
              <FormControl id="reason" isRequired>
                <FormLabel>Cancellation reason</FormLabel>
                <Input
                  variant={'outline'}
                  outlineColor="orange"
                  required
                  onChange={onReasonChange}
                  value={reason}
                  name="reason"
                  type="text"
                />
              </FormControl>
              <Box>
                <Divider mt={2} mb={2} />

                <Flex alignItems="center" justifyContent={'space-evenly'}>
                  <Text fontWeight={600} fontSize="lg">
                    Credit amount:
                  </Text>
                  <Text>{props.booking.amount}</Text>
                </Flex>
                <Divider mt={2} mb={2} />
              </Box>
            </Flex>
          </DrawerBody>

          <DrawerFooter
            justifyContent={'space-evenly'}
            display="flex"
            flexDirection={'column'}
          >
            <Text pb={4}>
              <strong>This cannot be undone</strong>
            </Text>
            <Flex>
              <Button
                colorScheme={'blue'}
                mr={3}
                onClick={onClose}
                size="lg"
                isDisabled={cancelLoading}
              >
                Go back
              </Button>
              <Button
                colorScheme="red"
                size={'lg'}
                onClick={cancelBooking}
                isLoading={cancelLoading}
                loadingText={'Cancelling...'}
              >
                Confirm cancellation
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default BookingAdmin;
