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
  updateDoc,
} from "firebase/firestore";
import db from "@/firebase/config";
import Image from "next/image";

interface TextFieldRef {
  ref: React.MutableRefObject<HTMLInputElement | null>;
  code: string;
}

interface ScavengerTeam {
  teamName: string;
  firstPlace: string;
  seccondPlace: string;
  thirdPlace: string;
}

const scavengerTeam: ScavengerTeam[] = [
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
  const [progress, setProgress] = useState<number | null>(0);
  const [isUsed, setIsUsed] = useState<boolean | null>();
  const timeStamp = moment().tz("Asia/Bangkok").format("HH:mm:ss");

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
    const joinedCode = code.join("").toLowerCase();
    const teamName = getTeamName(joinedCode);
    setTeamName(teamName);
    setIsCodeValid(teamName !== "");

    if (teamName) {
      setCode(Array(6).fill(""));
      inputRefs.current[0].ref.current?.focus();

      await handleValidCode(joinedCode);
    }

    console.log("Submitted codes:", joinedCode);
    console.log("Team Name:", teamName);
  };

  const getTeamName = (code2: string): string => {
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
      if (isUsedValidCode) {
        setIsUsed(isUsedValidCode.isUsed);
      }

      const currentPoint = (
        await getDoc(doc(db, foundTeamName, "sum-points"))
      ).data();

      if (currentPoint) {
        setProgress(currentPoint.point);
      }

      console.log("Order of valid code:", orderOfValidCode);

      if (isUsedValidCode && !isUsedValidCode.isUsed) {
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

          setProgress(newPoint);
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

  const imageStyle = {
    borderRadius: "8px",
    border: "1px solid #fff",
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
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontFamily: "VT323",
            textShadow: "2px 2px #7f00ff",
            color: "#ffffff",
          }}
        >
          Scavenger Hunt
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "normal",
            fontFamily: "VT323",
            textShadow: "1px 1px #7f00ff",
            color: "#000000",
          }}
        >
          CoE | First Meet
        </Typography>
        <Typography variant="h6" sx={{ mt: 14, fontFamily: "Noto Sans Thai" }}>
          จงแก้ปริศนาและกรอกโค้ด
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
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
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
              {isCodeValid && isUsed != true && (
                <>
                  <Image
                    src="https://i.ibb.co/TvVT3K6/valid-code.jpg"
                    width={225}
                    height={250}
                    alt="valid-code"
                    style={{ borderRadius: "8px", border: "1px solid #fff" }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: "bold",

                      mt: 2,

                      fontFamily: "VT323",
                    }}
                  >
                    Team : {teamName}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: "bold",

                      mt: 2,

                      fontFamily: "VT323",
                    }}
                  >
                    Time-Stamp : {timeStamp}
                  </Typography>
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      mt: 2,
                    }}
                  >
                    {progress && progress == 50 && (
                      <>
                        <Image
                          src="https://i.ibb.co/SfMQLkM/pixil-frame-0.png"
                          width={50}
                          height={50}
                          alt="valid-code"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #fff",
                          }}
                        />
                        <Image
                          src="https://i.ibb.co/d54z8Fz/pixil-frame-0-1.png"
                          width={50}
                          height={50}
                          alt="valid-code"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #fff",
                          }}
                        />
                        <Image
                          src="https://i.ibb.co/d54z8Fz/pixil-frame-0-1.png"
                          width={50}
                          height={50}
                          alt="valid-code"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #fff",
                          }}
                        />
                      </>
                    )}
                    {progress && progress == 100 && (
                      <>
                        <Image
                          src="https://i.ibb.co/SfMQLkM/pixil-frame-0.png"
                          width={50}
                          height={50}
                          alt="valid-code"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #fff",
                          }}
                        />
                        <Image
                          src="https://i.ibb.co/SfMQLkM/pixil-frame-0.png"
                          width={50}
                          height={50}
                          alt="valid-code"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #fff",
                          }}
                        />
                        <Image
                          src="https://i.ibb.co/d54z8Fz/pixil-frame-0-1.png"
                          width={50}
                          height={50}
                          alt="valid-code"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #fff",
                          }}
                        />
                      </>
                    )}
                    {progress && progress == 150 && (
                      <>
                        <Image
                          src="https://i.ibb.co/SfMQLkM/pixil-frame-0.png"
                          width={50}
                          height={50}
                          alt="valid-code"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #fff",
                          }}
                        />
                        <Image
                          src="https://i.ibb.co/SfMQLkM/pixil-frame-0.png"
                          width={50}
                          height={50}
                          alt="valid-code"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #fff",
                          }}
                        />
                        <Image
                          src="https://i.ibb.co/SfMQLkM/pixil-frame-0.png"
                          width={50}
                          height={50}
                          alt="valid-code"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #fff",
                          }}
                        />
                      </>
                    )}
                  </Stack>
                </>
              )}

              {(isCodeValid && isUsed == true) && (
                <Image
                  src="https://i.ibb.co/8dMw8vj/1.png"
                  width={225}
                  height={250}
                  alt="valid-code"
                  style={{ borderRadius: "8px", border: "1px solid #fff" }}
                />
              )}

              {isCodeValid == false && (
                <Image
                  src="https://i.ibb.co/60ngySD/invalid-code.jpg"
                  width={225}
                  height={250}
                  alt="valid-code"
                  style={{ borderRadius: "8px", border: "1px solid #fff" }}
                />
              )}

            </DialogContentText>
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
      </Container>
    </main>
  );
};

export default Home;
