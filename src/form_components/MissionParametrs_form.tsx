import React, { useState } from "react";
import {
  Flex,
  Input,
  Select,
  HStack,
  useRadioGroup,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import { RadioCard } from "../components/ui/RadioCard";
import { IoMdArrowDropdown } from "react-icons/io";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isMissionStart, missionParams, stepIndex } from "../stores/store";

type FormValues = {
  name: string;
  direction: string;
  date: string;
  typeOfMission: "Intelligence" | "Equipment" | "Settlement" | "";
};

const schema = yup
  .object({
    name: yup
      .string()
      .required(
        "Missiyanın Kod Adı: Daxil edilməsi məcburidir. Hər böyük missiyanın bir adı olmalıdır! (minimum 3 simvol)"
      )
      .min(
        3,
        "Missiyanın Kod Adı: Daxil edilməsi məcburidir. Hər böyük missiyanın bir adı olmalıdır! (minimum 3 simvol)"
      ),
    direction: yup
      .string()
      .required(
        "Təyinat Nöqtəsi: Seçilməsi məcburidir. Hədəfsiz səyahət olmaz."
      ),
    date: yup
      .string()
      .required(
        "Buraxılış Tarixi: Seçilməsi məcburidir və gələcək bir tarix olmalıdır. Keçmişə səyahət hələ ixtira edilməyib."
      )
      .test(
        "is-future-date",
        "Buraxılış Tarixi: Seçilməsi məcburidir və gələcək bir tarix olmalıdır. Keçmişə səyahət hələ ixtira edilməyib.",
        (val) => {
          if (!val) return false;
          const selected = new Date(val + "T00:00:00");
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selected > today;
        }
      ),
    typeOfMission: yup
      .mixed<FormValues["typeOfMission"]>()
      .oneOf(
        ["Intelligence", "Equipment", "Settlement"],
        "Missiyanın Növü: Seçilməsi məcburidir. Məqsədimiz nədir?"
      )
      .required("Missiyanın Növü: Seçilməsi məcburidir. Məqsədimiz nədir?"),
  })
  .required();

export const MissionParametrs_form: React.FC = () => {
  const options = ["Intelligence", "Equipment", "Settlement"];
  const [isControling, setIsControling] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      direction: "",
      date: "",
      typeOfMission: "Intelligence",
    },
  });

  const watchedType = watch("typeOfMission");

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "typeOfMission",
    value: watchedType,
    onChange: (val: string) =>
      setValue("typeOfMission", val as FormValues["typeOfMission"]),
  });
  const group = getRootProps();

  const onSubmit = (data: FormValues) => {
    setIsControling(true);
    if (missionParams.getState().missionName !== data.name) {
      setTimeout(() => {
        missionParams.getState().setMissionName(data.name);
        missionParams.getState().setMissionDate(data.date);
        missionParams.getState().setMissionDirection(data.direction);
        missionParams.getState().setMissionType(data.typeOfMission);
        stepIndex.getState().increaseIndex();
        isMissionStart().setIsStart();
        window.location.reload();
      }, 3000);
    } else {
      alert("Mission Name is Taken!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      {isControling ? (
        <Spinner />
      ) : (
        <Flex
          minH={"300px"}
          minW={"300px"}
          alignItems={"center"}
          justifyContent={"center"}
          wrap={"wrap"}
          bg={"#97b0a680"}
          borderRadius={"3xl"}
          gap={4}
          p={4}
          overflow={"auto"}
        >
          <Flex direction={"column"} gap={2} minW="240px">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel mb={0}>Name of Mission:</FormLabel>
              <Input placeholder="Mission Name..." {...register("name")} />
              <FormErrorMessage>
                {errors.name?.message as React.ReactNode}
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction={"column"} gap={2} minW="240px">
            <FormControl isInvalid={!!errors.direction}>
              <FormLabel mb={0}>Direction of Mission:</FormLabel>
              <Select
                icon={<IoMdArrowDropdown />}
                placeholder="Please Select Target of Mission"
                {...register("direction")}
              >
                <option value="Mars">Mars</option>
                <option value="Titan">Titan</option>
                <option value="Avropa">Avropa</option>
                <option value="Kepler-186f">Kepler-186f</option>
                <option value="TRAPPIST-1e">TRAPPIST-1e</option>
              </Select>
              <FormErrorMessage>
                {errors.direction?.message as React.ReactNode}
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction={"column"} gap={2} minW="200px">
            <FormControl isInvalid={!!errors.date}>
              <FormLabel mb={0}>Date of Mission:</FormLabel>
              <Input type="date" {...register("date")} />
              <FormErrorMessage>
                {errors.date?.message as React.ReactNode}
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction={"column"} gap={2} minW="300px" width="100%">
            <FormControl isInvalid={!!errors.typeOfMission}>
              <FormLabel mb={0}>Type of Mission:</FormLabel>
              <Flex wrap={"wrap"}>
                <HStack {...group} spacing={3}>
                  {options.map((value) => {
                    const radio = getRadioProps({ value });
                    return (
                      <RadioCard key={value} {...radio}>
                        {value}
                      </RadioCard>
                    );
                  })}
                </HStack>
              </Flex>
              <FormErrorMessage>
                {errors.typeOfMission?.message as React.ReactNode}
              </FormErrorMessage>
            </FormControl>
            <Button type="submit" mt={3} isLoading={isSubmitting}>
              Next!
            </Button>
          </Flex>
        </Flex>
      )}
    </form>
  );
};
