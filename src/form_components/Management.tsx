import React, { useEffect, useMemo, useState } from "react";
import {
  Flex,
  Select,
  Text,
  Checkbox,
  CheckboxGroup,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Badge,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { missionParams, formManagement, stepIndex } from "../stores/store";
import { Controller, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type RocketKey = "Starship" | "Falcon Heavy" | "Artemis V";

const ROCKETS: {
  value: RocketKey;
  label: string;
  maxKg: number;
  highRisk?: boolean;
}[] = [
  { value: "Starship", label: "Starship", maxKg: 100_000 },
  { value: "Falcon Heavy", label: "Falcon Heavy", maxKg: 64_000 },
  { value: "Artemis V", label: "Artemis V", maxKg: 150_000, highRisk: true },
];

const INTELLIGENCE = [
  "Spektrometr",
  "Rover (6 təkərli)",
  "Qazma qurğusu",
  "Atmosfer Sensoru",
  "Ekzo-DNT Sekvenseri",
];

const EQUIPMENT = [
  "Avtonom Yük Dronları",
  "Modulyar Anbar Konteynerləri",
  "Resurs Emalı Qurğusu",
  "Hidroponik Ferma Modulu",
];

const SETTLEMENT = [
  "Bio-Qübbə Başlanğıc Kiti",
  "Atmosfer Prosessoru",
  "3D-Habitat Printeri",
  "Su Təmizləmə Sistemi",
];

type FormValues = {
  rocket: RocketKey | "";
  totalWeight: number | 0;
  supplies: string[];
};

export const ManagementForm: React.FC = () => {
  const [missionType, setMissionType] = useState<string>("Intelligence");
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const validationSchema = yup.object({
    rocket: yup
      .string()
      .oneOf(ROCKETS.map((r) => r.value))
      .required("Raket seçimi məcburidir."),
    totalWeight: yup
      .number()
      .typeError("Zəhmət olmazsa rəqəm daxil edin.")
      .positive("Yük müsbət olmalıdır.")
      .required("Yükün ümumi çəkisi məcburidir.")
      .when("rocket", (rocket: unknown, schema: yup.NumberSchema) => {
        const selected = ROCKETS.find((r) => r.value === (rocket as RocketKey));
        if (selected) {
          return schema.max(
            selected.maxKg,
            `Fizika qanunlarına görə maksimal ${selected.maxKg.toLocaleString()} kg-dan çox ola bilməz.`
          );
        }
        return schema;
      }),
    supplies: yup
      .array()
      .of(yup.string())
      .min(1, "Seçilmiş missiya növünə uyğun ən azı 1 təchizat seçilməlidir."),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      rocket: "" as RocketKey | "",
      totalWeight: "",
      supplies: [],
    },
  });

  const selectedRocket = watch("rocket");
  const rocketInfo = useMemo(
    () => ROCKETS.find((r) => r.value === selectedRocket) ?? null,
    [selectedRocket]
  );

  useEffect(() => {
    setValue("supplies", []);
  }, [missionType, setValue]);

  const externalMissionType = missionParams.getState().missionType;

  useEffect(() => {
    if (externalMissionType === "Intelligence") {
      setMissionType("Intelligence");
    } else if (externalMissionType === "Equipment") {
      setMissionType("Equipment");
    } else if (externalMissionType === "Settlement") {
      setMissionType("Settlement");
    }
  }, [externalMissionType]);

  const supplyOptions =
    missionType === "Intelligence"
      ? INTELLIGENCE
      : missionType === "Equipment"
      ? EQUIPMENT
      : SETTLEMENT;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsChecking(true);
    setTimeout(() => {
      formManagement.getState().setRocket(data.rocket);
      formManagement.getState().setWeight(data.totalWeight);
      formManagement.getState().setMissionStaffs(data.supplies);
      stepIndex.getState().increaseIndex();
      window.location.reload();
    }, 3000);
  };

  return isChecking === true ? (
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
      width="100%"
    >
      <VStack spacing={4} w="100%" maxW="700px" align="stretch">
        <form onSubmit={handleSubmit<FormValues>(onSubmit)}>
          <Flex
            p={4}
            borderRadius="md"
            bg="whiteAlpha.200"
            alignItems="center"
            gap={4}
            wrap="wrap"
            direction={{ base: "column", md: "row" }}
          >
            <FormControl isInvalid={!!errors.rocket} maxW="320px">
              <FormLabel>Raket Seçimi</FormLabel>
              <Controller
                control={control}
                name="rocket"
                render={({ field }) => (
                  <Select placeholder="Raket seçin" {...field}>
                    {ROCKETS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </Select>
                )}
              />
              <FormErrorMessage>
                {errors.rocket?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <Text>
                Maksimum Yük:{" "}
                <b>
                  {rocketInfo ? `${rocketInfo.maxKg.toLocaleString()} kg` : "—"}
                </b>
              </Text>
              {rocketInfo?.highRisk && (
                <Badge colorScheme="red">Yüksək Riskli</Badge>
              )}
            </Flex>
            <FormControl isInvalid={!!errors.totalWeight} maxW="220px">
              <FormLabel>Yükün Ümumi Çəkisi (kg)</FormLabel>
              <Controller
                control={control}
                name="totalWeight"
                render={({ field }) => (
                  <NumberInput
                    min={0}
                    value={field.value ?? ""}
                    onChange={(val) => {
                      const parsed = val === "" ? "" : Number(val);
                      field.onChange(parsed);
                    }}
                  >
                    <NumberInputField />
                  </NumberInput>
                )}
              />
              <FormErrorMessage>
                {errors.totalWeight?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex
            p={4}
            borderRadius="md"
            bg="whiteAlpha.200"
            alignItems="flex-start"
            justifyContent={"center"}
            gap={4}
            direction={"column"}
            mt={4}
          >
            <FormControl isInvalid={!!errors.supplies}>
              <FormLabel>Missiya Təchizatı ({missionType})</FormLabel>
              <Controller
                control={control}
                name="supplies"
                render={({ field }) => (
                  <CheckboxGroup
                    value={field.value}
                    onChange={(v) => field.onChange(v)}
                  >
                    <Flex direction="column" gap={2}>
                      {supplyOptions.map((opt) => (
                        <Checkbox key={opt} value={opt}>
                          {opt}
                        </Checkbox>
                      ))}
                    </Flex>
                  </CheckboxGroup>
                )}
              />
              <FormErrorMessage>
                {errors.supplies?.message?.toString()}
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex mt={4} justifyContent="flex-end">
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              Send Your Mission into the Universe!
            </Button>
          </Flex>
        </form>
      </VStack>
    </Flex>
  );
};
