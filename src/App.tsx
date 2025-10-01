import "./App.css";
import {
  missionParams,
  staffs,
  formManagement,
  isMissionStart,
} from "./stores/store";
import { Flex, Text, useToast } from "@chakra-ui/react";
import { StepperCreator } from "./Stepper";
import { MissionParametrs_form } from "./form_components/MissionParametrs_form";
import { stepIndex } from "./stores/store";
import { StaffChoosing } from "./form_components/StaffChoosing";
import { ManagementForm } from "./form_components/Management";
import { useEffect, useState } from "react";

function App() {
  const [succesPercent, setSuccesPercent] = useState<number>(0);
  const missionStaffs = formManagement().missionStaffs;
  const missionStaffsCount = missionStaffs.length;
  const startState = isMissionStart();
  const mission = missionParams();
  const workerState = staffs();
  const formState = formManagement();

  const toast = useToast();

  useEffect(() => {
    const workers = workerState?.workers ?? [];
    const totalXp = workers.reduce((sum, w) => sum + (Number(w.xp) || 0), 0);
    const xpAverage: number = workers.length > 0 ? totalXp / workers.length : 0;
    setSuccesPercent(
      Math.round(xpAverage) * 10 - 3.14159 + missionStaffsCount + 10
    );
  }, [startState?.isStart, mission, workerState, formState, toast]);

  return (
    <Flex
      w={"100%"}
      minH={"100vh"}
      bgGradient="linear-gradient(9deg,rgba(87, 199, 133, 0.35) 0%, rgba(0, 0, 0, 1) 48%, rgba(87, 199, 133, 0.35) 100%)"
      alignItems={"center"}
      justifyContent={"center"}
      direction={"column"}
      gap={6}
      wrap={"wrap"}
      p={4}
    >
      <Text fontStyle={"italic"} fontSize={"32px"} color={"#b5ffd4ff"}>
        Launch Your own Rocket!
      </Text>
      <Flex overflow={"auto"} wrap={"wrap"}>
        <StepperCreator />
      </Flex>
      <Flex wrap={"wrap"} overflow={"auto"}>
        {stepIndex.getState().i === 0 ? (
          <MissionParametrs_form />
        ) : stepIndex.getState().i === 1 ? (
          <StaffChoosing />
        ) : stepIndex.getState().i === 2 ? (
          <ManagementForm />
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
            <Text>Your Succes Percent is {`${succesPercent}%!`}</Text>
            <Text
              fontStyle={"italic"}
              fontSize={"12px"}
              color={"#b5ffd4ff"}
              whiteSpace="pre-wrap"
            >{`(￣_,￣ )
              Good Luck
                        Explorer! Mission Name: ${mission?.missionName ?? "—"}
                        Mission Date: ${mission?.missionDate ?? "—"}
                        Mission Type: ${mission?.missionType ?? "—"}
                        Mission Direction: ${mission?.missionDirection ?? "—"}
                        Mission Workers:
                        ${
                          (workerState?.workers ?? [])
                            .map((n) => `- ${n.role}: ${n.name} (${n.xp} XP)`)
                            .join("\n") || "- None"
                        }
                        Mission Rocket: ${formState?.rocket ?? "—"}
                        Mission Staffs: ${
                          formState?.missionStaffs ?? "—"
                        }`}</Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default App;
