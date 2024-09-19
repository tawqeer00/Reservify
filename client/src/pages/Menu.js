import React, { useState } from 'react';
import {
  Flex,
  Box,
  Stack,
  Button,
  Link,
  Heading,
  Text,
  Divider,
  VStack,

  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,

  useDisclosure,

  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  InfoOutlineIcon,
  CalendarIcon,
  EditIcon,
  LockIcon,
} from '@chakra-ui/icons';
import Slider from 'react-slick';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import BASE_URL from '../env';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Menu(props) {
  const navigate = useNavigate();
  const userCheck = `${BASE_URL}/users/check`;

  useEffect(() => {
    if (!props.loggedIn.token) {
      navigate('/login');
    }
    axios
      .get(userCheck, {
        headers: { Authorization: `Bearer ${props.loggedIn.token}` },
      })
      .then(response => {
        if (response.data.role === 'admin') {
          navigate('/admin');
        } else if (response.data.role === 'guard') {
          navigate('/guard');
        } else if (response.data.role === 'user') {
          return;
        } else {
          props.setLogin({});
          props.logout();
          navigate('/login');
        }
      });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVenue, setSelectedVenue] = useState(null);

  const handleCardClick = (venue) => {
    setSelectedVenue(venue);
    onOpen();
  };




  const venues = [
    {
      name: 'Maths Department',
      description: 'The Maths department is equipped with modern facilities for seminars and meetings.',
      imageUrl: 'https://images.pexels.com/photos/1181394/pexels-photo-1181394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      detailedDescription: 'The Maths Department Hall can comfortably accommodate up to 100 attendees. It is equipped with modern audio-visual systems, including a projector, microphones, and sound system. The hall also features a large whiteboard and conference tables arranged in a U-shape. Amenities include high-speed Wi-Fi, air conditioning, ergonomic seating, easy access to restrooms, and parking. Refreshments can be arranged upon request.',
    },
    {
      name: 'Law Department',
      description: 'The Law department offers a spacious and well-equipped venue for legal discussions and conferences.',
      imageUrl: 'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg?auto=compress&cs=tinysrgb&w=600',
      detailedDescription: 'The Law Department Hall is suitable for gatherings of up to 120 people. It is equipped with a sophisticated audio-visual system, including a podium, microphone, projector, and large screen. The room layout is flexible to accommodate various meeting styles, from presentations to debates. Amenities include air conditioning, high-speed internet, ergonomic seating, in-house catering options, restrooms, and ample parking.',
    },
    {
      name: 'IT Department',
      description: 'The IT department has state-of-the-art facilities for tech meetings and presentations.',
      imageUrl: 'https://cdn.pixabay.com/photo/2018/05/09/07/11/architectural-3384683_640.jpg',
      detailedDescription: 'The IT Department Hall is designed to host up to 150 participants and is equipped with state-of-the-art computer stations with high-speed internet access, a large display screen for presentations, and integrated video conferencing equipment. The venue also provides comfortable seating with adjustable desks, air conditioning, on-site technical support, a kitchenette for catering services, and ample parking.',
    },
    {
      name: 'Physics Department',
      description: 'The Physics department provides a conducive environment for scientific discussions and events.',
      imageUrl: 'https://images.pexels.com/photos/236730/pexels-photo-236730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      detailedDescription: 'The Physics Department Hall can hold up to 80 people and features a comprehensive audio-visual setup, including a projector, large display screen, and surround sound system. The room includes a large central table and multiple smaller discussion tables. Amenities include high-speed Wi-Fi, climate control, comfortable seating, designated areas for breaks, and refreshments and catering services can be arranged.',
    },
  ];
  

  const cardSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };


  return (

    <Flex direction="column" minH="100vh"   >
      {/* Top Bar */}
      <Flex justify="space-between" align="center" px={8} py={3} boxShadow="md" bg='gray.100'>
        <Box>
          <Heading fontSize="4xl">Welcome, {props.loggedIn.name_first}</Heading>
          <Text fontSize="lg">{`Your credit is ${props.loggedIn.balance}`}</Text>
        </Box>


        <Box mt={2} textAlign="center">
          <Image
            src="https://cukapi.disgenweb.in/uploads/CUKLogo.png"
            alt="CUK Logo"
            width="60px"
            height="60px"
            mx="auto"
          />
        </Box>





      </Flex>

      {/* Main Content */}
      <Flex flex="1" bg='gray.50'>
        {/* Sidebar */}
        <Box w="20%" p={8} boxShadow="lg">
          <Stack spacing={6}>
            <RouteLink to={'/book'}>
              <Link
                color="green.500"
                fontSize="lg"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                _hover={{ textDecoration: 'underline' }}
                borderBottom="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')} // Adjusts border color based on the theme
                pb={2} // Padding at the bottom to give space between the text and border
              >
                <EditIcon mr={2} />
                New booking
              </Link>
            </RouteLink>
            <RouteLink to={'/Bookings'}>
              <Link
                color="blue.500"
                fontSize="lg"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                _hover={{ textDecoration: 'underline' }}
                borderBottom="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                pb={2}
              >
                <CalendarIcon mr={2} />
                My bookings
              </Link>
            </RouteLink>
            <RouteLink to={'/account'}>
              <Link
                color="blue.500"
                fontSize="lg"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                _hover={{ textDecoration: 'underline' }}
                borderBottom="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                pb={2}
              >
                <InfoOutlineIcon mr={2} />
                Manage account
              </Link>
            </RouteLink>
            <RouteLink to={'/howto'}>
              <Link
                color="blue.500"
                fontSize="lg"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                _hover={{ textDecoration: 'underline' }}
                borderBottom="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                pb={2}
              >
                <InfoOutlineIcon mr={2} />
                How to use?
              </Link>
            </RouteLink>
          </Stack>

          <Flex gap={4} mt={6} ml={-2} borderBottom="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.600')} pb={2}  >
            <ColorModeSwitcher />
            <Link
              onClick={() => {
                props.setLogin({});
                props.logout();
                navigate('/login');
              }}
              display="flex"
              alignItems="center"
              color="red.500"
              fontWeight="bold"
              fontSize="lg"
              _hover={{ textDecoration: 'underline' }}

            >
              <LockIcon mr={2} />
              Logout
            </Link>
          </Flex>





        </Box>





        {/* Hero Section with Carousel */}
        <Box flex="1">
          <Box width="1095px" height="538px" overflow="hidden" position="relative">
            <Slider {...sliderSettings}>
              {[
                {
                  imageUrl: "https://images.pexels.com/photos/2976970/pexels-photo-2976970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  title: "Conference Hall",
                  subtitle: "A spacious venue for large gatherings."
                },
                {
                  imageUrl: "https://cdn.pixabay.com/photo/2018/05/09/07/11/architectural-3384683_640.jpg",
                  title: "Seminar Room",
                  subtitle: "Ideal for workshops and seminars."
                },
                {
                  imageUrl: "https://images.pexels.com/photos/159213/hall-congress-architecture-building-159213.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  title: "Lecture Hall",
                  subtitle: "Perfect for academic presentations."
                },
                {
                  imageUrl: "https://images.pexels.com/photos/1181394/pexels-photo-1181394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                  title: "Meeting Room",
                  subtitle: "Cozy space for team meetings."
                },
              ].map((slide, index) => (
                <Box key={index} position="relative">
                  <img
                    src={slide.imageUrl}
                    alt={`Slide ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Box
                    position="absolute"
                    top="50%"
                    left="10%"
                    bgGradient="linear(to-t, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))"
                    color="white"
                    p={6}
                  >
                    <Heading fontSize="2xl">{slide.title}</Heading>
                    <Text fontSize="lg">{slide.subtitle}</Text>
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>



      </Flex>



      {/* Venue Cards */}
      <Flex direction="column" minH="100vh" width="1330px"  >
        <Box mt={12} px={2} >
          <Heading fontSize="2xl" mb={4} ml={4}>
            University Venue Blogs
          </Heading>
          <Slider {...cardSettings}>
            {venues.map((venue, index) => (
               <Box key={index}  py={2} px={2} > 
              <Box
                key={index}
                p={4}
                boxShadow="md"
                borderRadius="md"
                
                
                bg="white"
                onClick={() => handleCardClick(venue)}
                cursor="pointer"
              >
                <img
                  src={venue.imageUrl}
                  alt={venue.name}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <Heading fontSize="xl" mt={4}>
                  {venue.name}
                </Heading>
                <Text mt={2} noOfLines={3} overflow="hidden" textOverflow="ellipsis"
                  style={{

                    height: '45px',

                  }}
                >
                  {venue.description}
                </Text>
              </Box>
              </Box>
            ))}
          </Slider>
        </Box>

        {selectedVenue && (
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedVenue.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <img
                  src={selectedVenue.imageUrl}
                  alt={selectedVenue.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '16px',
                  }}
                />
                <Text>{selectedVenue.detailedDescription}</Text>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Flex>


      {/* Footer */}
<Box as="footer" px={4} pt={6} pb={4} mt={-20} bg='gray.100'>
  <VStack spacing={4}>
    <Text fontSize="lg" fontWeight="bold">RESERVIFY</Text>
    <Text fontSize="sm">Book your favorite venue for meetings, conferences, and events with ease.</Text>
    <Divider borderColor={useColorModeValue('gray.300', 'gray.700')} />
    <Flex justify="space-between" width="100%" maxW="6xl" mx="auto">
      <Box>
        <Heading fontSize="md">Quick Links</Heading>
        <Stack mt={4}>
          <RouteLink to="/book"><Link>New Booking</Link></RouteLink>
          <RouteLink to="/bookings"><Link>My Bookings</Link></RouteLink>
          <RouteLink to="/account"><Link>Manage Account</Link></RouteLink>
          <RouteLink to="/howto"><Link>How to Use?</Link></RouteLink>
        </Stack>
      </Box>
      <Box>
        <Heading fontSize="md">Contact Us</Heading>
        <Stack mt={4}>
          <Link href="mailto:tawkeer00@gmail.com">Tawkeer00@gmail.com</Link>
          <Link href="mailto:tawkeer00@gmail.com">Kitabmomin25@gmail.com</Link>
          <Link href="tel:+96006579990">(+91) 6006579990</Link>
        </Stack>
      </Box>
      <Box>
        <Heading fontSize="md">Follow Us</Heading>
        <Stack direction="row" mt={4} spacing={4}>
          <Link href="https://www.facebook.com" isExternal>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" width="24" height="24" />
          </Link>
          <Link href="https://www.twitter.com" isExternal>
            <img src="https://cdn-icons-png.freepik.com/256/5969/5969020.png?semt=ais_hybrid" alt="Twitter" width="24" height="24" />
          </Link>
          <Link href="https://www.linkedin.com" isExternal>
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Linkedin_icon.svg" alt="LinkedIn" width="24" height="24" />
          </Link>
        </Stack>
      </Box>
    </Flex>
    <Divider borderColor={useColorModeValue('gray.300', 'gray.700')} />
    <Text fontSize="sm"  color="gray.600">
      &copy; {new Date().getFullYear()} Reservify. All rights reserved.
    </Text>
  </VStack>
</Box>

    </Flex>

  );
}

export default Menu;


