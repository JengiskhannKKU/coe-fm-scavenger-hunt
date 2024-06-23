"use client";

import React, { useEffect, useState } from "react";
import { Button, Container, Typography } from "@mui/material";
import moment from "moment-timezone"; // Import Moment and Moment Timezone
import { getDocs, collection } from "firebase/firestore";
import db from "@/firebase/config";

const Home: React.FC = () => {
  const [startTimestamps, setStartTimestamps] = useState<any[]>([]);
  const [endTimestamps, setEndTimestamps] = useState<any[]>([]);
  const [diffTimestamps, setDiffTimestamps] = useState<any[]>([]);
  const [score, setScore] = useState<any[]>([]); // Initialize as an empty array

  // Function to calculate team scores
  const calculateTeamScore = (diffTimestamps: any[]) => {
    const MAX_TIME = 20;
    const MAX_SCORE = 480;

    const scores = diffTimestamps.map((diff) => {
      const score_1st = diff["1st"] !== null ? (MAX_TIME - diff["1st"]) * (MAX_SCORE / MAX_TIME) : 0;
      const score_2nd = diff["2nd"] !== null ? (MAX_TIME - diff["2nd"]) * (MAX_SCORE / MAX_TIME) : 0;
      const score_3rd = diff["3rd"] !== null ? (MAX_TIME - diff["3rd"]) * (MAX_SCORE / MAX_TIME) : 0;

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
      const diffData: any[] = startData.map((startTeam) => {
        const endTeam = endData.find((end) => end.teamName === startTeam.teamName);
        if (!endTeam) return { teamName: startTeam.teamName, "1st": null, "2nd": null, "3rd": null };

        const diff1st = startTeam["1st"] && endTeam["1st"]
          ? moment(endTeam["1st"], 'HH:mm:ss').diff(moment(startTeam["1st"], 'HH:mm:ss'), 'minutes', true)
          : null;
        const diff2nd = startTeam["2nd"] && endTeam["2nd"]
          ? moment(endTeam["2nd"], 'HH:mm:ss').diff(moment(startTeam["2nd"], 'HH:mm:ss'), 'minutes', true)
          : null;
        const diff3rd = startTeam["3rd"] && endTeam["3rd"]
          ? moment(endTeam["3rd"], 'HH:mm:ss').diff(moment(startTeam["3rd"], 'HH:mm:ss'), 'minutes', true)
          : null;

        return {
          teamName: startTeam.teamName,
          "1st": diff1st,
          "2nd": diff2nd,
          "3rd": diff3rd,
        };
      }).filter(Boolean);

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
            display: "flex",
            justifyContent: "center",
            fontWeight: "bold",
            fontFamily: "VT323",
            textShadow: "2px 2px #7f00ff",
            color: "#ffffff",
          }}
        >
          Ranking
        </Typography>

        <Button
          onClick={() => {
            console.log("Start Timestamps:", startTimestamps);
            console.log("End Timestamps:", endTimestamps);
            console.log("Diff Timestamps:", diffTimestamps);
            console.log("Scores:", score);
          }}
        >
          Check Team Timestamps
        </Button>
      </Container>
      {/* Display the scores */}
      {score.map((team, index) => (
        <Container
          key={index}
          maxWidth="xl"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mt: 2,
            padding: 4,
            border: "2px solid #ccc",
            borderRadius: 4,
            backgroundColor: "rgba(192, 192, 192, 0.7)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              fontFamily: "VT323",
              textShadow: "2px 2px #7f00ff",
              color: "#ffffff",
            }}
          >
            {team.teamName}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold",
              fontFamily: "VT323",
              textShadow: "2px 2px #ffffff",
              color: "#7f00ff",
            }}
          >
            : {team["1st"] + team["2nd"] + team["3rd"]} P.
          </Typography>
        </Container>
      ))}
    </main>
  );
};

export default Home;
