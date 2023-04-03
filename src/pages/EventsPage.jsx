import { Box, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState({});

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

  return (
    <>
      <Heading as="h1">Events</Heading>

      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3 }}
        spacing={5}
        justifyItems="center"
      >
        {events.map((event) => (
          <Link key={event.id} to={`/event/${event.id}`}>
            <Box
              key={event.id}
              p="6"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxSize="md"
              mt="50px"
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
                <Box>
                  Start Time: {new Date(event.startTime).toLocaleString()}
                </Box>
                <Box>End Time: {new Date(event.endTime).toLocaleString()}</Box>
              </Box>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </>
  );
};
