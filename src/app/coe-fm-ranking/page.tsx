"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Container,
  FormControl,
  Typography,
  TextField as MUITextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import moment from "moment-timezone"; // Import Moment and Moment Timezone
import {
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import db from "@/firebase/config";


const Home: React.FC = () => {
  const timeStamp = moment().tz("Asia/Bangkok").format("HH:mm:ss");
  const [teamName, setTeamName] = useState<string | null>();
  const [currentOrderPlace, setCurrentOrderPlace] = useState<string | null>();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStartEventTimeStamp = async () => {
    if (teamName && currentOrderPlace) {
      const data = {
        [currentOrderPlace]: timeStamp,
      };

      await updateDoc(doc(db, "startEventTimeStamp", teamName), data);
    }

    console.log("success");
    console.log(teamName + " : " + timeStamp);
  };

  return (
    <main>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
          padding: 4,
          border: "2px solid #ccc",
          borderRadius: 4,
          backgroundColor: "rgba(192, 192, 192, 0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        
      </Container>
    </main>
  );
};

export default Home;
