import { Container, Typography, Link } from '@mui/material'
import React from 'react'

const Navbar = () => {
  return (
    <Container
    maxWidth="xl"
    sx={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      mt: 10,
      padding: 1,
      border: "4px solid rgb(148, 137, 121)",
      borderRadius: 2,
      backgroundColor: "rgba(223, 208, 184, 0.75)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 4px rgba(0, 0, 0, 0.4)",
    }}
  >
    <Typography
      sx={{
        fontWeight: "400",
        fontFamily: "JetBrains Mono",
        fontStyle : 'normal',
        fontSize : '1.5rem'
      }}
      > 
      <Link
        href="https://www.instagram.com/9jengiskhann/"
        target="_blank"
        rel="noopener noreferrer"
        color="rgb(0, 0, 0)"
        >
        Back-end : jengiskhann
      </Link>
    </Typography>
    <Typography
      sx={{
        fontWeight: "400",
        fontFamily: "JetBrains Mono",
        fontStyle : 'normal',
        fontSize : '1.5rem'
      }}
      > 
      <Link
        href="https://www.instagram.com/9jengiskhann/"
        target="_blank"
        rel="noopener noreferrer"
        color="rgb(0, 0, 0)"
        >
        Front-end : ไอพีม
      </Link>
    </Typography>
  </Container>
  )
}

export default Navbar
