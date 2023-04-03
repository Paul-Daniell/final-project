import { Box, Button, Flex, Heading, Image, Input } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <>
      <Flex
        as="nav"
        justify="space-between"
        align="center"
        px={5}
        py={3}
        bg="gray.700"
      >
        <Box>
          <Image src="./img/Region.png" alt="Logo" w="150px" h="150px" />
        </Box>
        <Box>
          <Heading as="h2" size="lg" color="white">
            Where your events come together!
          </Heading>
        </Box>

        <Box>
          <Input placeholder="Search" mr={3} />
        </Box>
        <Box>
          <Link to="/new-event">
            <Button colorScheme="blue">Maak nieuw event</Button>
          </Link>
        </Box>
        <Box>
          <Link to="/new-user">
            <Button colorScheme="blue">create new user</Button>
          </Link>
        </Box>
      </Flex>
    </>
  );
};