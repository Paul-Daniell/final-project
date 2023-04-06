import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const EventPage = () => {
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setEditedEvent({ ...editedEvent, [e.target.name]: e.target.value });
  };

  return (
    <Box mt="50px">
      {!isEditing ? (
        <>
          <img src={event.image} alt={event.title} />
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
            <Input
              type="text"
              name="title"
              value={editedEvent.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              name="description"
              value={editedEvent.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="location">
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              name="location"
              value={editedEvent.location}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="startTime">
            <FormLabel>Start Time</FormLabel>
            <Input
              type="text"
              name="startTime"
              value={editedEvent.startTime}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="endTime">
            <FormLabel>End Time</FormLabel>
            <Input
              type="text"
              name="endTime"
              value={editedEvent.endTime}
              onChange={handleChange}
            />
          </FormControl>
          <Button onClick={handleSaveEvent}>Save Event</Button>
        </>
      )}
    </Box>
  );
};
