import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [createdBy, setCreatedBy] = useState(null);

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
    };

    fetchEvent();
    fetchCategories();
    fetchUsers();
  }, [eventId]);

  useEffect(() => {
    if (event && users.length > 0) {
      const createdByUser = users.find((user) => user.id === event.createdBy);
      setCreatedBy(createdByUser);
    }
  }, [event, users]);

  if (!event || !createdBy) {
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

  const selectedUsers = users.filter((user) =>
    event.attendedBy.includes(user.id)
  );

  return (
    <div>
      <h1>{event.name}</h1>
      <img src={event.image} alt={event.name} />
      <p>{event.description}</p>
      <p>Location: {event.location}</p>
      <p>
        Time: {event.startTime} - {event.endTime}
      </p>
      <p>Created By: {createdBy.name}</p>
      <p>
        Categories:{" "}
        {selectedCategories.map((category) => category.name).join(", ")}
      </p>
      <p>Attended By: {selectedUsers.map((user) => user.name).join(", ")}</p>
    </div>
  );
};
