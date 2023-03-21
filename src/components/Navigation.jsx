import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventCreated, setEventCreated] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createdBy: 2,
          title: data.title,
          description: data.description,
          image: data.image,
          category: data.category,
          attendedBy: data.attendedBy,
          location: data.location,
          startTime: data.startTime,
          endTime: data.endTime,
        }),
      });

      setEventCreated(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Flex
        as="nav"
        justify="space-between"
        align="center"
        px={5}
        py={3}
        bg="gray.700"
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
          <Input placeholder="Search" mr={3} />
        </Box>
        <Box>
          <Button colorScheme="blue" onClick={onOpen}>
            Maak nieuw event
          </Button>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nieuw event aanmaken</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              {eventCreated && (
                <Box mb={4} bg="green.50" p={4} borderRadius="md">
                  Event succesvol aangemaakt!
                </Box>
              )}
              <FormControl>
                <FormLabel htmlFor="title">Titel</FormLabel>
                <Input
                  id="title"
                  placeholder="Vul hier de titel in"
                  {...register("title", { required: true })}
                />
                {errors.title && <span>Dit veld is verplicht</span>}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel htmlFor="description">Beschrijving</FormLabel>
                <Input
                  id="description"
                  placeholder="Vul hier de beschrijving in"
                  {...register("description", { required: true })}
                />
                {errors.description && <span>Dit veld is verplicht</span>}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel htmlFor="image">Afbeelding</FormLabel>
                <Input
                  id="image"
                  placeholder="Vul hier de link naar de afbeelding in"
                  {...register("image", { required: true })}
                />
                {errors.image && <span>Dit veld is verplicht</span>}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel htmlFor="category">Categorie</FormLabel>
                <Input
                  id="category"
                  placeholder="Vul hier de categorie in"
                  {...register("category", { required: true })}
                />
                {errors.category && <span>Dit veld is verplicht</span>}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel htmlFor="attendedBy">Deelnemers</FormLabel>
                <Input
                  id="attendedBy"
                  placeholder="Vul hier het aantal deelnemers in"
                  {...register("attendedBy", { required: true })}
                />
                {errors.attendedBy && <span>Dit veld is verplicht</span>}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel htmlFor="location">Locatie</FormLabel>
                <Input
                  id="location"
                  placeholder="Vul hier de locatie in"
                  {...register("location", { required: true })}
                />
                {errors.location && <span>Dit veld is verplicht</span>}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel htmlFor="startTime">Starttijd</FormLabel>
                <Input
                  id="startTime"
                  placeholder="Vul hier de starttijd in"
                  {...register("startTime", { required: true })}
                />
                {errors.startTime && <span>Dit veld is verplicht</span>}
              </FormControl>

              <FormControl mt={4}>
                <FormLabel htmlFor="endTime">Eindtijd</FormLabel>
                <Input
                  id="endTime"
                  placeholder="Vul hier de eindtijd in"
                  {...register("endTime", { required: true })}
                />
                {errors.endTime && <span>Dit veld is verplicht</span>}
              </FormControl>

              <ModalFooter>
                <Button colorScheme="blue" type="submit">
                  Aanmaken
                </Button>
                <Button onClick={onClose} ml={3}>
                  Annuleren
                </Button>
              </ModalFooter>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
