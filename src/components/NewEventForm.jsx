import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
} from "@chakra-ui/react";

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
      attendedBy,
      location,
      startTime,
      endTime,
    } = formData;

    const selectedUsers = attendedBy.map((user) => parseInt(user));

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
      attendedBy: selectedUsers,
      location,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    });
    console.log(result.data);
    // reset form data
    setFormData({
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
  };
  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>Created By:</FormLabel>
        <Select
          name="createdBy"
          value={formData.createdBy}
          onChange={handleInputChange}
          placeholder="Select User"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <br />
      <FormControl>
        <FormLabel>Title:</FormLabel>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
      </FormControl>
      <br />
      <FormControl>
        <FormLabel>Description:</FormLabel>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          width="400px"
        />
      </FormControl>
      <br />
      <FormControl>
        <FormLabel>Image:</FormLabel>
        <Input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
        />
      </FormControl>
      <br />
      <FormControl>
        <FormLabel>Category:</FormLabel>
        <Select
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          placeholder="Select Category"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <br />
      <FormControl>
        <FormLabel>Attended By:</FormLabel>
        <Input
          type="text"
          name="attendedBy"
          value={formData.attendedBy}
          onChange={handleInputChange}
        />
      </FormControl>
      <br />
      <FormControl>
        <FormLabel>Location:</FormLabel>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
      </FormControl>
      <br />
      <FormControl>
        <FormLabel>Start Time:</FormLabel>
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleInputChange}
        />
      </FormControl>
      <br />
      <FormControl>
        <FormLabel>End Time:</FormLabel>
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleInputChange}
        />
      </FormControl>
      <br />
      <Button type="submit">Create Event</Button>
    </form>
  );
};
