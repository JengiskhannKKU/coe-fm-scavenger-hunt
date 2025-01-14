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
  Link,
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
import Navbar from "@/shared/components/navbar-component";

const Home: React.FC = () => {
  const timeStamp = moment().tz("Asia/Bangkok").format("HH:mm:ss");
  const [teamName, setTeamName] = useState<string | null>();
  const [currentOrderPlace, setCurrentOrderPlace] = useState<string | null>();
  const [isSubmitButtonSelected, setIsSubmitButtonSelected] =
    useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsSubmitButtonSelected(false);
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

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

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
        <Container>
          {/* ------------------- java --------------------- */}
          <Typography
            variant="h3"
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              fontFamily: "VT323",
              textShadow: "2px 2px #7f00ff",
              color: "#ffffff",
            }}
          >
            java
          </Typography>
          <Container
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",

              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("java");
                setCurrentOrderPlace("1st");
                handleClickOpen();
              }}
            >
              1st
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("java");
                setCurrentOrderPlace("2nd");
                handleClickOpen();
              }}
            >
              2nd
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("java");
                setCurrentOrderPlace("3rd");
                handleClickOpen();
              }}
            >
              3rd
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("java");
                setCurrentOrderPlace("4th");
                handleClickOpen();
              }}
            >
              4th
            </Button>
          </Container>

          {/* --------------------------- python ------------------------- */}
          <Typography
            variant="h3"
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              fontFamily: "VT323",
              textShadow: "2px 2px #7f00ff",
              color: "#ffffff",
            }}
          >
            python
          </Typography>
          <Container
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",

              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("python");
                setCurrentOrderPlace("1st");
                handleClickOpen();
              }}
            >
              1st
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("python");
                setCurrentOrderPlace("2nd");
                handleClickOpen();
              }}
            >
              2nd
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("python");
                setCurrentOrderPlace("3rd");
                handleClickOpen();
              }}
            >
              3rd
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("python");
                setCurrentOrderPlace("4th");
                handleClickOpen();
              }}
            >
              4th
            </Button>
          </Container>

          {/* -------------------------- c++ -------------------------- */}
          <Typography
            variant="h3"
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              fontFamily: "VT323",
              textShadow: "2px 2px #7f00ff",
              color: "#ffffff",
            }}
          >
            c++
          </Typography>
          <Container
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",

              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("c++");
                setCurrentOrderPlace("1st");
                handleClickOpen();
              }}
            >
              1st
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("c++");
                setCurrentOrderPlace("2nd");
                handleClickOpen();
              }}
            >
              2nd
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("c++");
                setCurrentOrderPlace("3rd");
                handleClickOpen();
              }}
            >
              3rd
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("c++");
                setCurrentOrderPlace("4th");
                handleClickOpen();
              }}
            >
              4th
            </Button>
          </Container>

          {/* ------------------------------- r-project ---------------------------- */}
          <Typography
            variant="h3"
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              fontFamily: "VT323",
              textShadow: "2px 2px #7f00ff",
              color: "#ffffff",
            }}
          >
            r-project
          </Typography>
          <Container
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",

              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("r-project");
                setCurrentOrderPlace("1st");
                handleClickOpen();
              }}
            >
              1st
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("r-project");
                setCurrentOrderPlace("2nd");
                handleClickOpen();
              }}
            >
              2nd
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("r-project");
                setCurrentOrderPlace("3rd");
                handleClickOpen();
              }}
            >
              3rd
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setTeamName("r-project");
                setCurrentOrderPlace("4th");
                handleClickOpen();
              }}
            >
              4th
            </Button>
          </Container>
          {/* ------------------------------- end ----------------------------- */}
        </Container>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ fontFamily: "VT323", fontWeight: "bold" }}>
            Start?
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{
                display: "flex",
                justifyContent: "center",
                fontWeight: "bold",

                mt: 2,

                fontFamily: "Noto Sans Thai",
              }}
            >
              {"ทีม:"}
              <br />
              {"สถานที่:  "}
              {"เวลา:"}
              <Container
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography>{teamName}</Typography>
                <Typography>{currentOrderPlace}</Typography>
                <Typography>{timeStamp}</Typography>
                {isSubmitButtonSelected && (
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans Thai",
                      fontWeight: "bold",
                      mt: 2,
                      mr: 2,
                    }}
                  >
                    เริ่มเกม!
                  </Typography>
                )}
              </Container>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                await handleStartEventTimeStamp();
                setIsSubmitButtonSelected(true);
                await delay(3000);
                handleClose();
              }}
              autoFocus
            >
              เริ่ม
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* ------------------------ Footer ------------------- */}

      <Navbar/>
    </main>
  );
};

export default Home;
