import "./App.css";
import { missionParams } from "./stores/store";
import { Flex, Text } from "@chakra-ui/react";
import { StepperCreator } from "./Stepper";
import { MissionParametrs_form } from "./form_components/MissionParametrs_form";
import { stepIndex } from "./stores/store";

function App() {
  return (
    <Flex
      w={"100%"}
      h={"100vh"}
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
        ) : (
          <p>Bu niye hazir deyil?</p>
        )}
      </Flex>
      <p>{missionParams.getState().missionDate}</p>
      <p>{missionParams.getState().missionDirection}</p>
      <p>{missionParams.getState().missionType}</p>
      <p>{missionParams.getState().missionName}</p>
    </Flex>
  );
}

export default App;
