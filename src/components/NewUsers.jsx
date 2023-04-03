import React, { useState } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Flex,
  Image,
  Center,
} from "@chakra-ui/react";

export const NewUserForm = () => {
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
      setName(value);
    } else if (name === "photoUrl") {
      setPhotoUrl(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const result = await axios.post("http://localhost:3000/users", {
        name,
        photoUrl,
      });
      console.log(result.data);
      // reset form data
      setName("");
      setPhotoUrl("");
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={error}>
        <FormLabel>Name</FormLabel>
        <Input
          name="name"
          value={name}
          onChange={handleInputChange}
          placeholder="Enter name"
        />
        <FormLabel>Photo URL</FormLabel>
        <Input
          name="photoUrl"
          value={photoUrl}
          onChange={handleInputChange}
          placeholder="Enter photo URL"
        />
        {photoUrl && (
          <Center my={2}>
            <Image src={photoUrl} alt="User" maxW="100px" maxH="100px" />
          </Center>
        )}
        <FormErrorMessage>{error}</FormErrorMessage>
        <Flex justify="center">
          <Button type="submit" mt={4} colorScheme="blue">
            Create User
          </Button>
        </Flex>
      </FormControl>
    </form>
  );
};
