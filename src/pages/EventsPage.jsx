import {
  Box,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Select,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch(`${API_URL}/events/`);
      const data = await response.json();
      setEvents(data);
    };

    const fetchCategories = async () => {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      const categoriesObject = {};
      data.forEach((category) => {
        categoriesObject[category.id] = category.name;
      });
      setCategories(categoriesObject);
    };

    fetchEvents();
    fetchCategories();
  }, []);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategorySelect = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredEvents = events.filter((event) => {
    if (selectedCategory) {
      const category = categories[event.categoryIds[0]];
      return (
        category === selectedCategory &&
        (event.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          event.description.toLowerCase().includes(searchInput.toLowerCase()))
      );
    } else {
      return (
        event.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        event.description.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
  });

  return (
    <>
      <Box
        bg="#fff"
        position="sticky"
        top="174"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        ml="90px"
        mr="90px"
      >
        <Heading as="h1" mr="100px">
          Events
        </Heading>
        <Input
          placeholder="Search"
          mr={3}
          onChange={handleSearchInput}
          color="#5271ff"
          borderColor="#5271ff"
          boxSize="md"
          height="40px"
        />
        <Select
          borderColor="#5271ff"
          color="#5271ff"
          placeholder="Filter by category"
          onChange={handleCategorySelect}
          value={selectedCategory}
          maxWidth="200px"
        >
          <option value="">All</option>
          <option value="Food">Food</option>
          <option value="Sport">Sport</option>
          <option value="Party">Party</option>
          <option value="Other">Other</option>
        </Select>
      </Box>

      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} justifyItems="center">
        {filteredEvents.map((event) => (
          <Link key={event.id} to={`/event/${event.id}`}>
            <Box
              key={event.id}
              p="6"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxSize="md"
              mt="50px"
              mb="20px"
              _hover={{ boxShadow: "lg" }}
            >
              <Image
                src={event.image}
                alt={event.title}
                width="400px"
                height="250px"
                borderWidth="1px"
                borderRadius="lg"
              />

              <Box mt="20px">
                <Box as="h4" fontWeight="semibold" isTruncated>
                  {event.title}
                </Box>
                <Box>{event.description}</Box>
                <Box>
                  Categories:{" "}
                  {event.categoryIds
                    .map((categoryId) => categories[categoryId])
                    .join(", ")}
                </Box>
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
              </Box>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
      <Box
        as="footer"
        bg="#5271ff"
        py="4"
        px="6"
        borderTop="1px solid"
        borderTopColor="gray.200"
      ></Box>
    </>
  );
};
