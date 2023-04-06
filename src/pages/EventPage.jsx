import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
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
          <img src={event.image} alt={event.title} width="800px" />
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <p>Location: {event.location}</p>
          <p>Start Time: {new Date(event.startTime).toLocaleString()}</p>
          <p>End Time: {new Date(event.endTime).toLocaleString()}</p>

          <p>
            Categories:{" "}
            {selectedCategories.map((category) => category.name).join(", ")}
          </p>
          <p>
            Created By: {createdByUser.name}
            {createdByUser && (
              <img
                src={createdByUser.photoUrl}
                width="80px"
                alt={createdByUser.name}
              />
            )}
          </p>
          <Button onClick={handleEditEvent}>Edit Event</Button>
        </>
      ) : (
        <>
          <FormControl id="title">
            <FormLabel>Title</FormLabel>
            <Text fontSize="sm">Change the title!</Text>
            <Input
              type="text"
              name="title"
              value={editedEvent.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Text fontSize="sm">Change the description!</Text>
            <Input
              type="text"
              name="description"
              value={editedEvent.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="location">
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
          <FormControl id="startTime">
            <FormLabel>Start Time</FormLabel>
            <Text fontSize="sm">
              The date and time will stay the same, unless you change it here!
            </Text>
            <Input
              name="startTime"
              type="datetime-local"
              value={editedEvent.startTime}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="endTime">
            <FormLabel>End Time</FormLabel>
            <Text fontSize="sm">
              The date and time will stay the same, unless you change it here!
            </Text>
            <Input
              name="endTime"
              type="datetime-local"
              value={editedEvent.endTime}
              onChange={handleChange}
            />
          </FormControl>
          <Button onClick={handleSaveEvent}>Save Event</Button>
        </>
      )}
      <Link to={"/"}>
        <Button onClick={handleDeleteEvent}>Delete Event</Button>
      </Link>
      <Link to={"/"}>
        <Button>Back to Events</Button>
      </Link>
    </Box>
  );
};
