"use client";

import React, { useEffect, useState } from "react";
import { Button, Container, Link, Stack, Typography } from "@mui/material";
import moment from "moment-timezone"; // Import Moment and Moment Timezone
import { getDocs, collection } from "firebase/firestore";
import db from "@/firebase/config";
import { morKhor } from "../assets/fonts";
import SearchIcon from "@mui/icons-material/Search";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Navbar from "@/shared/components/navbar-component";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { th } from "date-fns/locale";

const Home: React.FC = () => {
  const [startTimestamps, setStartTimestamps] = useState<any[]>([]);
  const [endTimestamps, setEndTimestamps] = useState<any[]>([]);
  const [diffTimestamps, setDiffTimestamps] = useState<any[]>([]);
  const [score, setScore] = useState<any[]>([]); // Initialize as an empty array

  // for showing on display
  const [c_score, setC_score] = useState<number>(0);
  const [j_score, setJ_score] = useState<number>(0);
  const [p_score, setP_score] = useState<number>(0);
  const [r_score, setR_score] = useState<number>(0);

  // Function to calculate team scores
  const calculateTeamScore = (diffTimestamps: any[]) => {
    const MAX_TIME = 10;
    const PENALTY_TIME = 9;
    const MAX_SCORE = 625;
    const PENALTY_SCORE = 62.5;

    const scores = diffTimestamps.map((diff) => {
      let score_1st = 0;
      let score_2nd = 0;
      let score_3rd = 0;
      let score_4th = 0;

      if (diff["1st"] !== null) {
        score_1st = diff["1st"] > PENALTY_TIME ? PENALTY_SCORE : (MAX_TIME - diff["1st"]) * (MAX_SCORE / MAX_TIME);
      }
      if (diff["2nd"] !== null) {
        score_2nd = diff["2nd"] > PENALTY_TIME ? PENALTY_SCORE : (MAX_TIME - diff["2nd"]) * (MAX_SCORE / MAX_TIME);
      }PENALTY_TIME
      if (diff["3rd"] !== null) {
        score_3rd = diff["3rd"] > PENALTY_TIME ? PENALTY_SCORE : (MAX_TIME - diff["3rd"]) * (MAX_SCORE / MAX_TIME);
      }
      if (diff["4th"] !== null) {
        score_4th = diff["4th"] > PENALTY_TIME ? PENALTY_SCORE : (MAX_TIME - diff["4th"]) * (MAX_SCORE / MAX_TIME);
      }

      // Ensure scores are formatted to 2 decimal places
      score_1st = parseFloat(score_1st.toFixed(2));
      score_2nd = parseFloat(score_2nd.toFixed(2));
      score_3rd = parseFloat(score_3rd.toFixed(2));
      score_4th = parseFloat(score_4th.toFixed(2));

      return {
        teamName: diff.teamName,
        "1st": score_1st,
        "2nd": score_2nd,
        "3rd": score_3rd,
        "4th": score_4th,
      };
    });

    setScore(scores);
  };

  useEffect(() => {
    const fetchStartData = async () => {
      const querySnapshotStart = await getDocs(
        collection(db, "startEventTimeStamp")
      );
      const data: any[] = [];

      querySnapshotStart.forEach((doc) => {
        const docData = doc.data();
        const formattedData = {
          teamName: doc.id,
          "1st": docData["1st"] || "",
          "2nd": docData["2nd"] || "",
          "3rd": docData["3rd"] || "",
          "4th": docData["4th"] || "",
        };
        data.push(formattedData);
      });

      setStartTimestamps(data);
    };

    const fetchEndData = async () => {
      const teamNames = ["c++", "java", "python", "r-project"];
      const data: any[] = [];

      for (const teamName of teamNames) {
        const docsSnapshot = await getDocs(collection(db, teamName));
        let teamData: any = {
          teamName: teamName,
          "1st": "",
          "2nd": "",
          "3rd": "",
          "4th": "",
        };

        docsSnapshot.forEach((doc) => {
          const docData = doc.data();
          if (doc.id === "1st") {
            teamData["1st"] = docData.timeStamp || "";
          } else if (doc.id === "2nd") {
            teamData["2nd"] = docData.timeStamp || "";
          } else if (doc.id === "3rd") {
            teamData["3rd"] = docData.timeStamp || "";
          } else if (doc.id === "4th") {
            teamData["4th"] = docData.timeStamp || "";
          }
        });

        data.push(teamData);
      }

      setEndTimestamps(data);
    };

    const calculateDiffTimestamps = (startData: any[], endData: any[]) => {
      const diffData: any[] = startData
        .map((startTeam) => {
          const endTeam = endData.find(
            (end) => end.teamName === startTeam.teamName
          );
          if (!endTeam)
            return {
              teamName: startTeam.teamName,
              "1st": null,
              "2nd": null,
              "3rd": null,
              "4th": null,
            };

          const diff1st =
            startTeam["1st"] && endTeam["1st"]
              ? moment(endTeam["1st"], "HH:mm:ss").diff(
                  moment(startTeam["1st"], "HH:mm:ss"),
                  "minutes",
                  true
                )
              : null;
          const diff2nd =
            startTeam["2nd"] && endTeam["2nd"]
              ? moment(endTeam["2nd"], "HH:mm:ss").diff(
                  moment(startTeam["2nd"], "HH:mm:ss"),
                  "minutes",
                  true
                )
              : null;
          const diff3rd =
            startTeam["3rd"] && endTeam["3rd"]
              ? moment(endTeam["3rd"], "HH:mm:ss").diff(
                  moment(startTeam["3rd"], "HH:mm:ss"),
                  "minutes",
                  true
                )
              : null;
          const diff4th =
            startTeam["4th"] && endTeam["4th"]
              ? moment(endTeam["4th"], "HH:mm:ss").diff(
                  moment(startTeam["4th"], "HH:mm:ss"),
                  "minutes",
                  true
                )
              : null;

          return {
            teamName: startTeam.teamName,
            "1st": diff1st,
            "2nd": diff2nd,
            "3rd": diff3rd,
            "4th": diff4th,
          };
        })
        .filter(Boolean);

      setDiffTimestamps(diffData);
    };

    const fetchData = async () => {
      await fetchStartData();
      await fetchEndData();
    };

    fetchData().then(() => {
      if (startTimestamps.length && endTimestamps.length) {
        calculateDiffTimestamps(startTimestamps, endTimestamps);
      }
    });
  }, [startTimestamps.length, endTimestamps.length]);

  useEffect(() => {
    if (diffTimestamps.length) {
      calculateTeamScore(diffTimestamps); // Call calculateTeamScore with diffTimestamps as argument
    }
  }, [diffTimestamps]);

  return (
    <main>
      <Stack
        direction="row"
        sx={{
          mt: 8,
          padding: 4,
          borderRadius: 4,
          backgroundColor: "rgb(255, 255, 255)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          width: "500px",
        }}
      >
        <div style={{ marginLeft: "10px" }}>
          <EmojiEventsIcon
            sx={{ width: "150px", height: "100px", color: "rgb(255, 193, 0)" }}
          />
        </div>
        <div style={{ marginLeft: "15px" }}>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: morKhor.style.fontWeight,
              fontFamily: morKhor.style.fontFamily,
              // textShadow: "2px 2px #7f00ff",
              color: "rgb(21, 52, 72)",
              fontSize: "100px",
            }}
          >
            Ranking
          </Typography>
        </div>
      </Stack>
      <div
        style={{
          width: "500px",
          height: "100px",
          display: "flex",
          flexDirection: "row",
          marginTop: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "rgb(223, 208, 184)",
            padding: 2,
            borderRadius: "20px",
            height: "50px",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            onClick={() => {
              console.log("Start Timestamps:", startTimestamps);
              console.log("End Timestamps:", endTimestamps);
              console.log("Diff Timestamps:", diffTimestamps);
              console.log("Scores:", score);
              {
                /* Display the scores */
              }
            }}
          >
            Check Team Timestamps
          </Button>
        </div>
      </div>

      {score.map((team, index) => (
        <Container
          key={index}
          maxWidth="xl"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
            // padding: 4,
            // border: "2px solid #ccc",
            // borderRadius: 4,
            // backgroundColor: "rgba(192, 192, 192, 0.7)",
            // backdropFilter: "blur(10px)",
            // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "500px",
              height: "100px",
              alignItems: "center",
              backgroundColor: "rgb(255, 255, 255)",
              flexDirection: "column",
              color: "rgb(21, 52, 72)",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 12px 4px rgba(0, 0, 0, 0.4)",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: morKhor.style.fontWeight,
                fontFamily: morKhor.style.fontFamily,
              }}
            >
              {team.teamName}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "200px",
              height: "100px",
              alignItems: "center",
              backgroundColor: "rgb(255, 255, 255)",
              marginLeft: "50px",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 12px 4px rgba(0, 0, 0, 0.4)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                justifyContent: "center",
                fontWeight: morKhor.style.fontWeight,
                fontFamily: morKhor.style.fontFamily,
                textShadow: "2px 2px #ffffff",
                color: "rgb(21, 52, 72)",
              }}
            >
              {team.teamName === "c++"
                ? c_score.toFixed(2)
                : team.teamName === "java"
                ? j_score.toFixed(2)
                : team.teamName === "python"
                ? p_score.toFixed(2)
                : team.teamName === "r-project"
                ? r_score.toFixed(2)
                : ""}
            </Typography>
          </div>
          <Button
            id={team.teamName}
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              alignItems: "center",
              backgroundColor: "rgb(21, 52, 72)",
              marginLeft: "50px",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 12px 4px rgba(0, 0, 0, 0.4)",
            }}
            onClick={(e) => {
              let totalDiffTime = 0;
              if (e.currentTarget.id === "c++") {
                totalDiffTime =
                  diffTimestamps[0]["1st"] +
                  diffTimestamps[0]["2nd"] +
                  diffTimestamps[0]["3rd"] +
                  diffTimestamps[0]["4th"];
              } else if (e.currentTarget.id === "java") {
                totalDiffTime =
                  diffTimestamps[1]["1st"] +
                  diffTimestamps[1]["2nd"] +
                  diffTimestamps[1]["3rd"] +
                  diffTimestamps[1]["4th"];
              } else if (e.currentTarget.id === "python") {
                totalDiffTime =
                  diffTimestamps[2]["1st"] +
                  diffTimestamps[2]["2nd"] +
                  diffTimestamps[2]["3rd"] +
                  diffTimestamps[2]["4th"];
              } else if (e.currentTarget.id === "r-project") {
                totalDiffTime =
                  diffTimestamps[3]["1st"] +
                  diffTimestamps[3]["2nd"] +
                  diffTimestamps[3]["3rd"] +
                  diffTimestamps[3]["4th"];
              }

              alert(
                `Total Difference Time for ${
                  e.currentTarget.id
                }: ${totalDiffTime.toFixed(2)} minutes`
              );
            }}
          >
            <AccessTimeIcon/>
          </Button>
          <Button
            id={team.teamName}
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              alignItems: "center",
              backgroundColor: "rgb(21, 52, 72)",
              marginLeft: "50px",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 12px 4px rgba(0, 0, 0, 0.4)",
            }}
            onClick={(e) => {
              if (e.currentTarget.id === "c++") {
                setC_score(
                  score[0]["1st"] +
                    score[0]["2nd"] +
                    score[0]["3rd"] +
                    score[0]["4th"]
                );
              } else if (e.currentTarget.id === "java") {
                setJ_score(
                  score[1]["1st"] +
                    score[1]["2nd"] +
                    score[1]["3rd"] +
                    score[1]["4th"]
                );
              } else if (e.currentTarget.id === "python") {
                setP_score(
                  score[2]["1st"] +
                    score[2]["2nd"] +
                    score[2]["3rd"] +
                    score[2]["4th"]
                );
              } else if (e.currentTarget.id === "r-project") {
                setR_score(
                  score[3]["1st"] +
                    score[3]["2nd"] +
                    score[3]["3rd"] +
                    score[3]["4th"]
                );
              }
            }}
          >
            <SearchIcon fontSize="large" sx={{ color: "rgb(255, 255, 255)" }} />
          </Button>
        </Container>
      ))}

      {/* ------------------------ Footer ------------------- */}
      <Navbar />
    </main>
  );
};

export default Home;
