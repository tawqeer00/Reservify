// import React from 'react'
// import { Flex, Stack, Divider, Heading, Button, Text } from '@chakra-ui/react';
// import { Link as RouteLink } from 'react-router-dom';
// import { FaArrowLeft, FaCaretLeft } from 'react-icons/fa';

// function Howto() {
//   return (
//     <Flex
//       minH={'100vh'}
//       align={'flex-start'}
//       justify={'center'}
//     >
//       <Stack spacing={4} mx={'auto'} maxW={'lg'} py={4} px={4} w='full'>
//       <RouteLink to={'/'}>
//                 <Button
//                   size="sm"
//                   colorScheme={'blue'}
//                   leftIcon={<FaArrowLeft/>}
//                 >
//                   Back to menu
//                 </Button>
//               </RouteLink>
//         <Stack align={'center'} px={4}>
//           <Heading fontSize={'2xl'}>How to use the booking system</Heading>
//           <Divider />
//           <Heading fontSize={'large'}>1. Balance top-up</Heading>
//             <Text>1.1. You can top-up your credits by contacting the admin.</Text>
//             <Text>1.2. You may top-up any amount, the amount will be reflected in your balance and is available for use at any time.</Text>
//             <Text>1.3. <strong>If your balance is depleted or is lower than your desired booking cost, you will not be able to complete the booking.</strong></Text>
//           <Divider/>
//           <Heading fontSize={'large'}>2. Booking</Heading>
//           <Text>2.1. To make a booking, click on "Make a booking" from the main menu.</Text>
//           <Text>2.2. On the "New Booking" screen, select the desired date and click on "Check availability". <strong>(you will get an error if you select a date in the past)</strong></Text>
//           <Text>2.3. Select the desired time slots. <strong>Time slots are 30 minute slots.</strong></Text>
//           <Text>2.4. Once desired time slots appear in the "Selected" column, click "Book".</Text>
          
//           <Text>2.5. Time slots that are <strong>disabled (greyed out) are unavailable</strong>. Either because they are in the past, or already booked by someone else.</Text>
//             <Text>2.6. A booking must be at least 1 hour long <strong>(minimum 2 time slots).</strong></Text>
//             <Text>2.7. A booking must contain <strong>only consecutive time slots</strong>. If you need to book non-consecutive time slots, you may do so in a new booking.</Text>
//             <Text>2.8. If you get an error, pay attention to the details in the <strong>error message</strong>.</Text>
//             <Divider/>
//             <Heading fontSize={'large'}>3. Cancellation</Heading>
//             <Text>2.1. You can cancel a booking at any time, <strong>before its start time</strong>.</Text>
//             <Text>2.2. Upon cancellation, you will <strong>automatically receive credit</strong> for the booking.</Text>
//             <Text>2.3. If you <strong>already checked-in</strong> with the guard, the booking <strong>cannot be cancelled</strong>.</Text>
//             <Text>2.4. In the event you require a credit or partial credit for a booking after its start time, please see juristic office for further assistance.</Text>
            
//         </Stack>
//       </Stack>
//     </Flex>
//   )
// }

// export default Howto


import React from 'react';
import { Flex, Stack, Divider, Heading, Button, Text, Box, useColorModeValue } from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function Howto() {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
      p={4}
    >
      <Stack
        spacing={6}
        mx={'auto'}
        maxW={'2xl'}
        p={6}
        bg={useColorModeValue('white', 'gray.700')}
        borderRadius={'md'}
        boxShadow={'lg'}
      >
        <RouteLink to={'/'}>
          <Button
            size="md"
            colorScheme={'blue'}
            leftIcon={<FaArrowLeft />}
            variant={'solid'}
            alignSelf={'start'}
          >
            Back to menu
          </Button>
        </RouteLink>

        <Stack spacing={4}>
          <Heading fontSize={'3xl'} textAlign={'center'}>
            How to Use Reservify
          </Heading>
          
          <Divider />

          <Box p={4} borderRadius={'md'} bg={useColorModeValue('blue.50', 'blue.800')}>
            <Heading fontSize={'xl'} mb={2}>1. Balance Top-up</Heading>
            <Text mb={2}>1.1. You can top-up your credits by contacting the admin.</Text>
            <Text mb={2}>1.2. You may top-up any amount; the amount will be reflected in your balance and is available for use at any time.</Text>
            <Text mb={2}><strong>If your balance is depleted or is lower than your desired booking cost, you will not be able to complete the booking.</strong></Text>
          </Box>

          <Divider />

          <Box p={4} borderRadius={'md'} bg={useColorModeValue('green.50', 'green.800')}>
            <Heading fontSize={'xl'} mb={2}>2. Booking</Heading>
            <Text mb={2}>2.1. To make a booking, click on "Make a booking" from the main menu.</Text>
            <Text mb={2}>2.2. On the "New Booking" screen, select the desired date and click on "Check availability". <strong>(You will get an error if you select a date in the past)</strong></Text>
            <Text mb={2}>2.3. Select the desired time slots. <strong>Time slots are 30-minute slots.</strong></Text>
            <Text mb={2}>2.4. Once desired time slots appear in the "Selected" column, click "Book".</Text>
            <Text mb={2}>2.5. Time slots that are <strong>disabled (greyed out) are unavailable</strong>. Either because they are in the past, or already booked by someone else.</Text>
            <Text mb={2}>2.6. A booking must be at least 1 hour long <strong>(minimum 2 time slots).</strong></Text>
            <Text mb={2}>2.7. A booking must contain <strong>only consecutive time slots</strong>. If you need to book non-consecutive time slots, you may do so in a new booking.</Text>
            <Text mb={2}>2.8. If you get an error, pay attention to the details in the <strong>error message</strong>.</Text>
          </Box>

          <Divider />

          <Box p={4} borderRadius={'md'} bg={useColorModeValue('red.50', 'red.800')}>
            <Heading fontSize={'xl'} mb={2}>3. Cancellation</Heading>
            <Text mb={2}>3.1. You can cancel a booking at any time, <strong>before its start time</strong>.</Text>
            <Text mb={2}>3.2. Upon cancellation, you will <strong>automatically receive credit</strong> for the booking.</Text>
            <Text mb={2}>3.3. If you <strong>already checked-in</strong> with the guard, the booking <strong>cannot be cancelled</strong>.</Text>
            <Text mb={2}>3.4. In the event you require a credit or partial credit for a booking after its start time, please see the juristic office for further assistance.</Text>
          </Box>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default Howto;
