import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  Tooltip,
  Heading,
  Image,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export const EventPage = () => {
  const toast = useToast();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [createdByUser, setCreatedByUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`http://localhost:3000/events/${eventId}`);
      const data = await response.json();
      setEvent(data);
    };

    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      setCategories(data);
    };

    const fetchUsers = async () => {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsers(data);
      const user = data.find((user) => user.id === event.createdBy);
      setCreatedByUser(user);
    };

    fetchEvent();
    fetchCategories();
    fetchUsers();
  }, [eventId]);

  useEffect(() => {
    if (event && users.length > 0) {
      const createdByUser = users.find((user) => user.id === event.createdBy);
      setCreatedByUser(createdByUser);
    }
  }, [event, users]);

  if (!event || !createdByUser) {
    return <div>Loading...</div>;
  }

  console.log(categories);
  console.log(users);

  if (!categories || categories.length === 0) {
    return null; // of doe iets anders
  }

  const selectedCategories = categories.filter((category) =>
    event.categoryIds.includes(category.id)
  );

  const handleEditEvent = () => {
    setIsEditing(true);
    setEditedEvent({ ...event });
  };

  const handleSaveEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify(editedEvent),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setEvent(data);
      setIsEditing(false);
      toast({
        title: "Event saved.",
        description: "The event was successfully edited and saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setEditedEvent({ ...editedEvent, [e.target.name]: e.target.value });
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast({
          title: "Event deleted.",
          description: "The event was successfully deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // redirect to home page or some other page
      } else {
        toast({
          title: "Error deleting event.",
          description: "An error occurred while deleting the event.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hours =
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  return (
    <Box mt="50px">
      {!isEditing ? (
        <>
          <Box>
            <Box ml="15px">
              <Heading as="h3" fontSize="lg">
                Created By: {createdByUser.name}
              </Heading>
              {createdByUser && (
                <img
                  src={createdByUser.photoUrl}
                  width="80px"
                  alt={createdByUser.name}
                />
              )}
            </Box>

            <Box
              border="4px"
              borderColor="#5271ff"
              borderRadius="50%"
              width="900px"
              height="600px"
              ml="400px"
              mt="-100px"
            >
              <Image
                src={event.image}
                alt={event.title}
                width="600px"
                height="450px"
                borderRadius="50%"
                mt="10px"
                ml="10px"
                border="8px"
                borderColor="#5271ff"
              />
              <Box ml="50px" mt="-500px">
                <Heading
                  as="h1"
                  fontSize="8xl"
                  fontWeight="extrabold"
                  color="white"
                  style={{
                    textOutline: "2px 2px 0 #5271ff",
                    WebkitTextStroke: "2px #5271ff", // voor Safari
                  }}
                >
                  {event.title}
                </Heading>
              </Box>
            </Box>
          </Box>

          <Box
            position="absolute"
            top="60%"
            left="55%"
            transform="translate(-10%, -70%)"
          >
            <Text>
              Categorie:{" "}
              {selectedCategories.map((category) => category.name).join(", ")}
            </Text>
            <Text>
              Start Time:{" "}
              {new Date(event.startTime).toLocaleString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text>
              End Time:{" "}
              {new Date(event.endTime).toLocaleString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            <Text> Description: </Text>
            <Text> {event.description}</Text>
            <Text>Location: </Text>
            <Text>{event.location}</Text>
          </Box>
          <Box
            position="absolute"
            top="40%"
            left="2%"
            transform="translate(-10%, -30%)"
          >
            <Button
              onClick={handleEditEvent}
              bg="#5271ff"
              color="white"
              mr="5px"
              _hover={{ bg: "green.400" }}
            >
              Edit Event
            </Button>
            <Link to={"/"}>
              <Button bg="#5271ff" color="white" _hover={{ bg: "yellow.400" }}>
                Back to Events
              </Button>
            </Link>
          </Box>
          <Box>
            <Tooltip
              isOpen={showTooltip}
              label="Are you sure you want to delete this Event? This can't be undone!"
              bg="red.400"
              fontSize="xl"
            >
              <Link to={"/"}>
                <Button
                  onClick={handleDeleteEvent}
                  bg="red.400"
                  _hover={{ bg: "red.300" }}
                  color="white"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  Delete Event
                </Button>
              </Link>
            </Tooltip>
          </Box>
        </>
      ) : (
        <>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box width="800px">
              <FormControl id="image" width="100%">
                <FormLabel>Image</FormLabel>
                <Text fontSize="sm">Change the Url</Text>
                <Input
                  type="text"
                  name="image"
                  value={editedEvent.image}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="title" width="100%">
                <FormLabel>Title</FormLabel>
                <Text fontSize="sm">Change the title!</Text>
                <Input
                  type="text"
                  name="title"
                  value={editedEvent.title}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="description" width="100%">
                <FormLabel>Description</FormLabel>
                <Text fontSize="sm">Change the description!</Text>
                <Input
                  type="text"
                  name="description"
                  value={editedEvent.description}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="location" width="100%">
                <FormLabel>Location</FormLabel>
                <Text fontSize="sm">
                  Change the location! Do not forget address and city
                </Text>
                <Input
                  type="text"
                  name="location"
                  value={editedEvent.location}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="startTime" width="100%">
                <FormLabel>Start Time</FormLabel>
                <Text fontSize="sm">
                  The date and time will stay the same, unless you change it
                  here!
                </Text>
                <Input
                  name="startTime"
                  type="datetime-local"
                  value={editedEvent.startTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="endTime" width="100%">
                <FormLabel>End Time</FormLabel>
                <Text fontSize="sm">
                  The date and time will stay the same, unless you change it
                  here!
                </Text>
                <Input
                  name="endTime"
                  type="datetime-local"
                  value={editedEvent.endTime}
                  onChange={handleChange}
                />
              </FormControl>
              <Button
                onClick={handleSaveEvent}
                bg="#5271ff"
                color="white"
                _hover={{ bg: "green.400" }}
                width="100%"
                mt="20px"
              >
                Save Event
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};
