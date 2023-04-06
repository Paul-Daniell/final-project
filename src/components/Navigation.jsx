import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
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
        position="sticky"
        top="0"
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
          <Link to="/new-event">
            <Button bg="#5271ff" color="white" _hover={{ bg: "blue.300" }}>
              Create new event
            </Button>
          </Link>
        </Box>
      </Flex>
    </>
  );
};
