import React from "react";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";

interface BoxProps {
  character: string;
  rotate: string;
}

const Box: React.FC<BoxProps> = ({ character, rotate}) => {
  return (
    <div
      style={{
        transform: `rotate(${rotate})`,
        width: '30px',
        height: '30px',
        // boxShadow: "0px 4px 16px lightgrey",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background : 'rgba(249,88,60, 0.9)'
      }}
    >
      <Typography variant="subtitle1" color="black">
        {character}
      </Typography>
    </div>
  );
};

const BoxWord: React.FC = () => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        marginTop: "100px",
        marginLeft: "15px",
        marginRight: "15px",
      }}
    >
      <Box character="C" rotate="38deg" />
      <Box character="O" rotate="20deg" />
      <Box character="E" rotate="-15deg" />
      <Box character="X" rotate="-30deg" />
      <Box character="D" rotate="45deg" />
      <Box character="M" rotate="-22deg" />
      <Box character="E" rotate="12deg" />
    </Stack>
  );
};

export default BoxWord;
