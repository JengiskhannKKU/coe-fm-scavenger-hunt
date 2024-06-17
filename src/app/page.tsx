"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
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
  CircularProgress,
} from "@mui/material";
import db from "@/firebase/config";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { string } from "yup";
import { COMPILER_INDEXES } from "next/dist/shared/lib/constants";
import { update } from "firebase/database";
import { timeStamp } from "console";
import Image from 'next/image'

interface TextFieldRef {
  ref: React.MutableRefObject<HTMLInputElement | null>;
  code: string;
}

const scavengerTeam = [
  {
    teamName: "java",
    firstPlace: "1jcode",
    seccondPlace: "2jcode",
    thirdPlace: "3jcode",
  },
  {
    teamName: "c++",
    firstPlace: "1ccode",
    seccondPlace: "2ccode",
    thirdPlace: "3ccode",
  },
  {
    teamName: "python",
    firstPlace: "1pcode",
    seccondPlace: "2pcode",
    thirdPlace: "3pcode",
  },
  {
    teamName: "r-project",
    firstPlace: "1rcode",
    seccondPlace: "2rcode",
    thirdPlace: "3rcode",
  },
];

const Home: React.FC = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [teamName, setTeamName] = useState<string>("");
  const [isCodeValid, setIsCodeValid] = useState<boolean>(true);

  const inputRefs = useRef<TextFieldRef[]>(
    Array.from({ length: 6 }, () => ({
      // eslint-disable-next-line react-hooks/rules-of-hooks
      ref: useRef<HTMLInputElement | null>(null),
      code: "",
    }))
  );

  const handleInputChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].ref.current?.focus();
    }
  };

  const handleSubmit = async () => {
    const joinedCode = code.join("");
    const teamName = getTeamName(joinedCode);
    setTeamName(teamName);
    setIsCodeValid(teamName !== "");

    if (teamName) {
      // Reset the code input fields if the code is valid
      setCode(Array(6).fill(""));
      inputRefs.current[0].ref.current?.focus();

      // Check for code validity in the database
      await handleValidCode(joinedCode);
    }

    console.log("Submitted codes:", joinedCode);
    console.log("Team Name:", teamName);
  };

  const getTeamName = (code2: string) => {
    for (const element of scavengerTeam) {
      if (
        code2 === element.firstPlace ||
        code2 === element.seccondPlace ||
        code2 === element.thirdPlace
      ) {
        return element.teamName;
      }
    }
    return "";
  };

  const handleValidCode = async (code2: string) => {
    let orderOfValidCode = "";
    let foundTeamName = "";

    for (const element of scavengerTeam) {
      if (code2 === element.firstPlace) {
        orderOfValidCode = "1st";
        foundTeamName = element.teamName;
        break;
      } else if (code2 === element.seccondPlace) {
        orderOfValidCode = "2nd";
        foundTeamName = element.teamName;
        break;
      } else if (code2 === element.thirdPlace) {
        orderOfValidCode = "3rd";
        foundTeamName = element.teamName;
        break;
      }
    }

    if (foundTeamName && orderOfValidCode) {
      const validCodeTeamCollectionRef = doc(
        db,
        foundTeamName,
        orderOfValidCode
      );
      const isUsedValidCode = (await getDoc(validCodeTeamCollectionRef)).data();
      const currentPoint = (
        await getDoc(doc(db, foundTeamName, "sum-points"))
      ).data();

      console.log("Order of valid code:", orderOfValidCode);

      if (isUsedValidCode && isUsedValidCode.isUsed != true) {
        console.log("Is code used:", isUsedValidCode.isUsed);

        await updateDoc(validCodeTeamCollectionRef, {
          isUsed: true,
          timeStamp: serverTimestamp(),
        });

        if (currentPoint) {
          let newPoint = currentPoint.point + 50;

          await updateDoc(doc(db, foundTeamName, "sum-points"), {
            point: newPoint,
          });
        }
      }
    } else {
      console.log("No matching code found");
    }
  };

  useEffect(() => {
    const handleFocus = (index: number) => {
      inputRefs.current[index].ref.current?.select();
    };

    inputRefs.current.forEach((_, index) => {
      const ref = inputRefs.current[index].ref.current;
      if (ref) {
        ref.addEventListener("focus", () => handleFocus(index));
      }
    });

    return () => {
      inputRefs.current.forEach((_, index) => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const ref = inputRefs.current[index].ref.current;
        if (ref) {
          ref.removeEventListener("focus", () => handleFocus(index));
        }
      });
    };
  }, []);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    handleSubmit();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <main>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
          padding: 4,
          border: "1px solid #ccc",
          borderRadius: 4,
          backgroundColor: "#f0f0f0",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", fontFamily: "VT323" }}
        >
          Scavenger Hunt
        </Typography>

        <Typography
          variant="h5"
          sx={{ fontWeight: "normal", fontFamily: "VT323" }}
        >
          CoE First Meet
        </Typography>

        <Typography variant="h6" sx={{ mt: 14, fontFamily: "Noto Sans Thai" }}>
          กรอกโค้ด
        </Typography>

        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
            gap: 0.4,
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: 1,
            backgroundColor: "#f0f0f0",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {inputRefs.current.map((inputRef, index) => (
            <React.Fragment key={index}>
              <MUITextField
                variant="outlined"
                size="small"
                sx={{ width: 40 }}
                inputRef={inputRef.ref}
                value={code[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                autoFocus={index === 0}
              />
              {index !== inputRefs.current.length - 1 &&
                index !== 3 &&
                index !== 0 &&
                index !== 2 && <Typography variant="h6">-</Typography>}
            </React.Fragment>
          ))}
        </FormControl>

        <Button
          variant="contained"
          sx={{ mt: 8, px: 4, borderRadius: 4, fontFamily: "Noto Sans Thai" }}
          onClick={handleClickOpen}
        >
          ใช้โค้ด
        </Button>

        <React.Fragment>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={{ fontFamily: "VT323", fontWeight: "bold" }}
            >
              {teamName ? `Team: ${teamName}` : "Team: None"}
            </DialogTitle>

            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {isCodeValid ? (
                  <Image src="/assets/valid-code.png" width={250} height={300} alt="valid-code" />
                ) : (
                  <Image src="/assets/invalid-code.png" width={250} height={300} alt="invalid-code" />
                )}
              </DialogContentText>

              <React.Fragment>
                <svg width={0} height={0}>
                  <defs>
                    <linearGradient
                      id="my_gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#CDC2AE" />
                      <stop offset="100%" stopColor="#C2DEDC" />
                    </linearGradient>
                  </defs>
                </svg>
                <CircularProgress
                  sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
                />
              </React.Fragment>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 8,
                  px: 4,
                  borderRadius: 4,
                  fontFamily: "Noto Sans Thai",
                }}
                onClick={handleClose}
              >
                ตกลง
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </Container>
    </main>
  );
};

export default Home;
