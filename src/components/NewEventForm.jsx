import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Box,
} from "@chakra-ui/react";

import { NewUserForm } from "./NewUsers";
import { Link } from "react-router-dom";

export const NewEventForm = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    createdBy: "",
    title: "",
    description: "",
    image: "",
    categoryIds: [],
    attendedBy: [],
    location: "",
    startTime: "",
    endTime: "",
  });
  const [setError] = useState("");

  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  const handleOpenNewUserModal = () => {
    setIsNewUserModalOpen(true);
  };

  const handleCloseNewUserModal = () => {
    setIsNewUserModalOpen(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await axios.get("http://localhost:3000/users");
      setUsers(result.data);
    };

    const fetchCategories = async () => {
      const result = await axios.get("http://localhost:3000/categories");
      setCategories(result.data);
    };

    fetchUsers();
    fetchCategories();
  }, []);

  const toast = useToast();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "category") {
      setFormData({ ...formData, [name]: [value] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, categoryIds: [parseInt(value)] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      createdBy,
      title,
      description,
      image,
      categoryIds,
      location,
      startTime,
      endTime,
    } = formData;

    try {
      const events = await axios.get("http://localhost:3000/events");
      const newId = events.data.length
        ? events.data[events.data.length - 1].id + 1
        : 1;

      const result = await axios.post("http://localhost:3000/events", {
        id: newId,
        createdBy: parseInt(createdBy),
        title,
        description,
        image,
        categoryIds,

        location,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });
      console.log(result.data);
      toast({
        title: "Event created.",
        description:
          "Your event has been successfully created, create another or go back to Events",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // reset form data
      setFormData({
        createdBy: "",
        title: "",
        description: "",
        image: "",
        categoryIds: [],
        location: "",
        startTime: "",
        endTime: "",
      });
    } catch (e) {
      console.log(e);
      setError("Failed to create event. Please try again.");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt="10px">
      <form onSubmit={handleSubmit}>
        <FormControl id="createdBy" isRequired width="800px">
          <FormLabel>Created By</FormLabel>
          <Select
            name="createdBy"
            onChange={handleInputChange}
            value={formData.createdBy}
            placeholder="Select User"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={handleOpenNewUserModal}
          bg="#5271ff"
          color="white"
          mt="5px"
          _hover={{ bg: "green.400" }}
        >
          Create New User
        </Button>
        <Modal isOpen={isNewUserModalOpen} onClose={handleCloseNewUserModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <NewUserForm closeModal={handleCloseNewUserModal} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <FormControl id="title" isRequired width="800px">
          <FormLabel>Title</FormLabel>
          <Input
            name="title"
            onChange={handleInputChange}
            value={formData.title}
          />
        </FormControl>
        <FormControl id="description" isRequired width="800px">
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            onChange={handleInputChange}
            value={formData.description}
          />
        </FormControl>
        <FormControl id="image" isRequired width="800px">
          <FormLabel>Image</FormLabel>
          <Input
            name="image"
            onChange={handleInputChange}
            value={formData.image}
          />
        </FormControl>
        <FormControl id="categoryIds" isRequired width="800px">
          <FormLabel>Category</FormLabel>
          <Select
            name="category"
            onChange={handleCategoryChange}
            value={formData.categoryIds[0]}
            placeholder="Select Category"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="location" isRequired width="800px">
          <FormLabel>Location</FormLabel>
          <Input
            name="location"
            onChange={handleInputChange}
            value={formData.location}
            placeholder="Please fill in the address and city of the event!"
          />
        </FormControl>
        <FormControl id="startTime" isRequired width="800px">
          <FormLabel>Start Time</FormLabel>
          <Input
            type="datetime-local"
            name="startTime"
            onChange={handleInputChange}
            value={formData.startTime}
          />
        </FormControl>
        <FormControl id="endTime" isRequired width="800px">
          <FormLabel>End Time</FormLabel>
          <Input
            type="datetime-local"
            name="endTime"
            onChange={handleInputChange}
            value={formData.endTime}
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="green"
          bg="#5271ff"
          color="white"
          mt="5px"
          mr="5px"
          _hover={{ bg: "green.400" }}
        >
          Create Event
        </Button>
        <Link to="/">
          <Button
            bg="#5271ff"
            color="white"
            mt="5px"
            _hover={{ bg: "yellow.400" }}
          >
            Back to Events
          </Button>
        </Link>
      </form>
    </Box>
  );
};
