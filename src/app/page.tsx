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
  Divider,
  Avatar,
  Box,
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
import { hetKhonFont, maliFont, morKhor } from "./assets/fonts/index";
import TourIcon from "@mui/icons-material/Tour";
import { ScavengerTeam } from "@/shared/interfaces";
import Navbar from "@/shared/components/navbar-component";

interface TextFieldRef {
  ref: React.MutableRefObject<HTMLInputElement | null>;
  code: string;
}

const scavengerTeam: ScavengerTeam[] = [
  {
    teamName: "java",
    firstPlace: "1jcode",
    seccondPlace: "2jcode",
    thirdPlace: "3jcode",
    fourthPlace: "4jcode"
  },
  {
    teamName: "c++",
    firstPlace: "1ccode",
    seccondPlace: "2ccode",
    thirdPlace: "3ccode",
    fourthPlace: "4ccode"
  },
  {
    teamName: "python",
    firstPlace: "1pcode",
    seccondPlace: "2pcode",
    thirdPlace: "3pcode",
    fourthPlace: "4pcode"
  },
  {
    teamName: "r-project",
    firstPlace: "1rcode",
    seccondPlace: "2rcode",
    thirdPlace: "3rcode",
    fourthPlace: "4rcode"
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
    newCode[index] = value.trim(); // Trim the value to avoid blank spaces
    setCode(newCode);

    if (value !== "" && index < inputRefs.current.length - 1) {
      // Move focus to the next field if it's not the last field
      inputRefs.current[index + 1].ref.current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "Backspace" && code[index] === "") {
      if (index > 0) {
        const previousIndex = index - 1;
        inputRefs.current[previousIndex].ref.current?.focus();
        inputRefs.current[previousIndex].ref.current?.select();
      }
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
        code2 === element.thirdPlace ||
        code2 === element.fourthPlace
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
      } else if (code2 === element.fourthPlace) {
        orderOfValidCode = "4th";
        foundTeamName = element.teamName;
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
          timeStamp: timeStamp,
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

  const getRandomRotation = () => `${Math.floor(Math.random() * 80 - 40)}deg`;
  const getRandomSize = () => `${Math.floor(Math.random() * 18 + 25)}px`;

  const characters = ["C", "O", "E", "X", "D", "M", "E"];

  return (
    <main>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "0 0.5rem 0.5rem 0.5rem",
            maxWidth: "500px",
          }}
        >
          {/* <div
            style={{
              backgroundColor: "rgb(231, 228, 242)",
              borderRadius: "0 0 10px 10px",
              padding: "0.25rem",
              width: "250px",
              height: "45px",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Pacifico, cursive",
                fontWeight: "400",
                fontStyle: "normal",
                fontSize: "1.5rem",
              }}
            >
              Scavenger Hunt
            </Typography>
          </div> */}
        </div>
        {/* <BoxWord /> */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "white",
            height: "400px",
            marginTop: "50px",
            borderRadius: "10px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 16px 16px rgba(0, 0, 0, 0.4)",
          }}
        >
          <Stack direction="column" spacing={2}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h3"
                color="initial"
                sx={{
                  fontFamily: morKhor.style.fontFamily,
                  fontWeight: "400",
                  fontStyle: "normal",
                  color: "rgb(21, 52, 72)",
                }}
              >
                FIRSTMEET
              </Typography>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  variant="h5"
                  color="initial"
                  sx={{
                    fontFamily: morKhor.style.fontFamily,
                    fontWeight: "400",
                    fontStyle: "normal",
                    color: "rgb(21, 52, 72)",
                  }}
                >
                  SCAVENGER HUNT 2024
                </Typography>
                <TourIcon fontSize="large" />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              ></div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  variant="h5"
                  color="grey"
                  sx={{
                    fontFamily: morKhor.style.fontFamily,
                    fontWeight: morKhor.style.fontWeight,
                  }}
                >
                  กรอกโค้ดตรงนี้ได้เลย!!
                </Typography>
              </div>

              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 2,
                  gap: 0.4,
                  border: "3px dashed rgb(223, 208, 184)",
                  borderRadius: 1,
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
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      autoFocus={index === 0}
                    />
                    {index !== inputRefs.current.length - 1 &&
                      index !== 3 &&
                      index !== 0 &&
                      index !== 2 && <Typography variant="h6">-</Typography>}
                  </React.Fragment>
                ))}
              </FormControl>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  variant="h5"
                  color="grey"
                  sx={{
                    fontFamily: morKhor.style.fontFamily,
                    fontWeight: morKhor.style.fontWeight,
                  }}
                >
                  ถ้ามั่นใจก็กดยืนยันได้เลยคับ
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    px: 4,
                    borderRadius: 2,
                    backgroundColor: "rgb(21, 52, 72)",
                  }}
                  onClick={handleClickOpen}
                >
                  <Typography
                    variant="h5"
                    color="initial"
                    sx={{
                      fontFamily: morKhor.style.fontFamily,
                      fontWeight: morKhor.style.fontWeight,
                      color: "white",
                    }}
                  >
                    ยืนยัน
                  </Typography>
                </Button>
              </div>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle
                  id="alert-dialog-title"
                  sx={{
                    fontFamily: morKhor.style.fontFamily,
                    fontWeight: morKhor.style.fontWeight,
                  }}
                >
                  {teamName ? `Team: ${teamName}` : "Team: None"}
                </DialogTitle>

                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {isCodeValid && isUsed !== true && (
                      <>
                        <Image
                          src="https://i.ibb.co/TvVT3K6/valid-code.jpg"
                          width={225}
                          height={250}
                          alt="valid-code"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #fff",
                          }}
                        />
                        <Typography
                          variant="h4"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            fontWeight: morKhor.style.fontWeight,

                            mt: 2,

                            fontFamily: morKhor.style.fontFamily,
                          }}
                        >
                          Team : {teamName}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            fontWeight: morKhor.style.fontWeight,

                            mt: 2,

                            fontFamily: morKhor.style.fontFamily,
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
                          {progress && progress == 200 && (
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

                    {isCodeValid && isUsed == true && (
                      <Image
                        src="https://i.ibb.co/8dMw8vj/1.png"
                        width={225}
                        height={250}
                        alt="valid-code"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #fff",
                        }}
                      />
                    )}

                    {isCodeValid == false && (
                      <Image
                        src="https://i.ibb.co/60ngySD/invalid-code.jpg"
                        width={225}
                        height={250}
                        alt="valid-code"
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #fff",
                        }}
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
                      px: 2,
                      borderRadius: 4,
                      fontFamily: morKhor.style.fontFamily,
                      fontWeight: morKhor.style.fontWeight,
                      backgroundColor: "rgb(21, 52, 72)",
                      fontSize: "1.3rem",
                    }}
                    onClick={handleClose}
                  >
                    ตกลง
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Stack>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "right", marginTop: "10px" }}
      >
        <Stack direction="row" spacing={2}>
          <Box
            width={25}
            height={25}
            p={1}
            sx={{ backgroundColor: "white", borderRadius: "8px" }}
          ></Box>
          <Box
            width={25}
            height={25}
            p={1}
            sx={{ backgroundColor: "white", borderRadius: "8px" }}
          ></Box>
          <Box
            width={25}
            height={25}
            p={1}
            sx={{ backgroundColor: "white", borderRadius: "8px" }}
          ></Box>
        </Stack>
      </div>
      {/* ------------------------ Footer ------------------- */}
      <Navbar />
    </main>
  );
};

export default Home;
