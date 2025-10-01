import {
  Flex,
  Input,
  Select,
  Text,
  Button,
  IconButton,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useForm, useFieldArray } from "react-hook-form";
import { staffs, stepIndex } from "../stores/store";
import { useState } from "react";

type CrewMember = {
  name: string;
  role: string;
  xp: number;
};

type FormValues = {
  missionType: string;
  crew: CrewMember[];
  crewRange?: string;
  commanderCount?: string;
};

export function StaffChoosing() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      missionType: "standard",
      crew: [
        { name: "", role: "", xp: 1 },
        { name: "", role: "", xp: 1 },
        { name: "", role: "", xp: 1 },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "crew",
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);

  watch("missionType");
  const onSubmit = (data: FormValues) => {
    clearErrors("commanderCount");
    const crewLen = (data.crew || []).length;
    const commanderCount = (data.crew || []).filter(
      (m) => m.role === "Commander"
    ).length;
    if (commanderCount > 1) {
      setError("commanderCount", {
        type: "manual",
        message: "Heyətdə yalnız bir Komandir ola bilər.",
      });
      return;
    }
    for (let i = 0; i < crewLen; i++) {
      const xp = Number(data.crew[i].xp);
      if (!Number.isInteger(xp) || xp < 1 || xp > 10) {
        setError(`crew.${i}.xp`, {
          type: "manual",
          message: "XP 1 ilə 10 arasında tam ədəd olmalıdır.",
        });
        return;
      }
    }
    if (data.missionType === "supply") {
      if (crewLen === 1 && commanderCount !== 1) {
        setError("crewRange", {
          type: "manual",
          message:
            "Tək heyət yalnız Komandir olmalıdır (təchizat missiyası üçün).",
        });
        return;
      }
      if (crewLen > 7) {
        setError("crewRange", {
          type: "manual",
          message: "Heyət üzvlərinin sayı maksimum 7 ola bilər.",
        });
        return;
      }
    } else {
      if (crewLen < 3 || crewLen > 7) {
        setError("crewRange", {
          type: "manual",
          message: "Missiyada minimum 3, maksimum 7 heyət üzvü olmalıdır.",
        });
        return;
      }
    }
    for (let i = 0; i < crewLen; i++) {
      const m = data.crew[i];
      if (!m.name || !m.role) {
        setError("crewRange", {
          type: "manual",
          message: "Hər bir heyət üzvünün adı və vəzifəsi məcburidir.",
        });
        return;
      }
    }
    setIsChecking(true);
    setTimeout(() => {
      staffs.getState().setWorkers(data.crew);
      stepIndex.getState().increaseIndex();
      window.location.reload();
    }, 3000);
  };
  return (
    <Flex
      p={6}
      direction={"column"}
      alignItems="center"
      justifyContent="center"
    >
      {isChecking ? (
        <Spinner />
      ) : (
        <Flex
          minH={"300px"}
          minW={"300px"}
          alignItems={"center"}
          justifyContent={"center"}
          wrap={"wrap"}
          direction={"column"}
          bg={"#97b0a680"}
          borderRadius={"3xl"}
          gap={4}
          p={4}
          overflow={"auto"}
        >
          <Flex direction={"column"}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack align="stretch" spacing={6}>
                <HStack justifyContent="space-between">
                  <Text fontSize="xl" color="#98eebcff">
                    Heyət Üzvləri
                  </Text>
                  <HStack>
                    <Button
                      leftIcon={<AddIcon />}
                      onClick={() => {
                        if ((fields.length || 0) >= 7) return;
                        append({ name: "", role: "", xp: 1 });
                      }}
                      isDisabled={fields.length >= 7}
                    >
                      Add a Member
                    </Button>
                    <Text color="red.400">{errors.crewRange?.message}</Text>
                    <Text color="red.400">
                      {errors.commanderCount?.message}
                    </Text>
                  </HStack>
                </HStack>
                <VStack align="stretch" spacing={4}>
                  {fields.map((field, index) => (
                    <Flex
                      key={field.id}
                      p={4}
                      borderRadius="md"
                      bg="whiteAlpha.200"
                      alignItems="center"
                      gap={4}
                    >
                      <FormControl isInvalid={!!errors?.crew?.[index]?.name}>
                        <FormLabel>Name</FormLabel>
                        <Input
                          placeholder="Name of Worker..."
                          {...register(`crew.${index}.name`, {
                            required: "Name is required",
                            minLength: { value: 3, message: "leatest than 3" },
                          })}
                        />
                        <FormErrorMessage>
                          {errors?.crew?.[index]?.name?.message}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors?.crew?.[index]?.role}>
                        <FormLabel>Role</FormLabel>
                        <Select
                          placeholder="Change Type"
                          {...register(`crew.${index}.role`, {
                            required: "Type is required",
                          })}
                        >
                          <option value="Commander">Commander</option>
                          <option value="Pilot">Pilot</option>
                          <option value="Engineer">Engineer</option>
                          <option value="Scientist">Scientist</option>
                          <option value="Xenobotanic">Xenobotanic</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Android">Android</option>
                        </Select>
                        <FormErrorMessage>
                          {errors?.crew?.[index]?.role?.message}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isInvalid={!!errors?.crew?.[index]?.xp}
                        maxW="220px"
                      >
                        <FormLabel>XP (1 - 10)</FormLabel>
                        <NumberInput min={1} max={10} defaultValue={field.xp}>
                          <NumberInputField
                            {...register(`crew.${index}.xp`, {
                              required: "XP is required",
                              valueAsNumber: true,
                              validate: (v) =>
                                Number.isInteger(Number(v)) && v >= 1 && v <= 10
                                  ? true
                                  : "XP 1 ilə 10 arasında tam ədəd olmalıdır",
                            })}
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>
                          {errors?.crew?.[index]?.xp?.message}
                        </FormErrorMessage>
                      </FormControl>
                      <IconButton
                        aria-label="remove"
                        icon={<DeleteIcon />}
                        onClick={() => remove(index)}
                      />
                    </Flex>
                  ))}
                </VStack>
                <Button type="submit" colorScheme="teal">
                  Send Mission
                </Button>
                <Box>
                  <Text fontSize="sm" color="gray.200">
                    Qaydalar:
                  </Text>
                  <Text fontSize="sm">
                    • Normal missiyalar üçün heyət: 3 - 7 üzv.
                  </Text>
                  <Text fontSize="sm">
                    • Təchizat (Supply) missiyasında Komandir tək qala bilər.
                  </Text>
                  <Text fontSize="sm">
                    • Heyətdə maksimum 1 Komandir ola bilər.
                  </Text>
                  <Text fontSize="sm">
                    • Hər üzvün adı və vəzifəsi məcburidir; XP 1-10 arası
                    olmalıdır.
                  </Text>
                </Box>
              </VStack>
            </form>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
