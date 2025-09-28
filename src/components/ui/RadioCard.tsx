import { Box, useRadio } from "@chakra-ui/react";

export function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const radio = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...radio}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={4}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
}
