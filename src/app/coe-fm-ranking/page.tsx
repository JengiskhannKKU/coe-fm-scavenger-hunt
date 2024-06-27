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

const Home: React.FC = () => {
  const [startTimestamps, setStartTimestamps] = useState<any[]>([]);
  const [endTimestamps, setEndTimestamps] = useState<any[]>([]);
  const [diffTimestamps, setDiffTimestamps] = useState<any[]>([]);
  const [score, setScore] = useState<any[]>([]); // Initialize as an empty array

  // Function to calculate team scores
  const calculateTeamScore = (diffTimestamps: any[]) => {
    const MAX_TIME = 10;
    const MAX_SCORE = 62.5;

    const scores = diffTimestamps.map((diff) => {
      let score_1st = 0;
      let score_2nd = 0;
      let score_3rd = 0;

      if (diff["1st"] !== null && diff["1st"] <= MAX_TIME) {
        score_1st = (MAX_TIME - diff["1st"]) * (MAX_SCORE / MAX_TIME);
      }
      if (diff["2nd"] !== null && diff["2nd"] <= MAX_TIME) {
        score_2nd = (MAX_TIME - diff["2nd"]) * (MAX_SCORE / MAX_TIME);
      }
      if (diff["3rd"] !== null && diff["3rd"] <= MAX_TIME) {
        score_3rd = (MAX_TIME - diff["3rd"]) * (MAX_SCORE / MAX_TIME);
      }

      // Ensure scores are formatted to 2 decimal places
      score_1st = parseFloat(score_1st.toFixed(2));
      score_2nd = parseFloat(score_2nd.toFixed(2));
      score_3rd = parseFloat(score_3rd.toFixed(2));

      return {
        teamName: diff.teamName,
        "1st": score_1st,
        "2nd": score_2nd,
        "3rd": score_3rd,
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
        };

        docsSnapshot.forEach((doc) => {
          const docData = doc.data();
          if (doc.id === "1st") {
            teamData["1st"] = docData.timeStamp || "";
          } else if (doc.id === "2nd") {
            teamData["2nd"] = docData.timeStamp || "";
          } else if (doc.id === "3rd") {
            teamData["3rd"] = docData.timeStamp || "";
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

          return {
            teamName: startTeam.teamName,
            "1st": diff1st,
            "2nd": diff2nd,
            "3rd": diff3rd,
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
        ></div>
      </div>

      {/* <Button
            onClick={() => {
              console.log("Start Timestamps:", startTimestamps);
              console.log("End Timestamps:", endTimestamps);
              console.log("Diff Timestamps:", diffTimestamps);
              console.log("Scores:", score);
            }}
          >
            Check Team Timestamps
          </Button> */}
      {/* Display the scores */}
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
              {parseFloat(team["1st"] + team["2nd"] + team["3rd"]).toFixed(2)}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "200px",
              height: "100px",
              alignItems: "center",
              backgroundColor: "rgb(21, 52, 72)",
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
                // textShadow: "2px 2px #ffffff",
                color: "rgb(255,255,255)",
              }}
            >
            Time
            </Typography>
          </div>
          <div
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
          >
            <SearchIcon fontSize="large" sx={{ color: "rgb(255, 255, 255)" }} />
          </div>
        </Container>
      ))}

      {/* ------------------------ Footer ------------------- */}
      <Navbar />
    </main>
  );
};

export default Home;
