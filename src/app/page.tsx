"use client"

import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Typography,
  TextField as MUITextField,
} from '@mui/material';
import db from '@/firebase/config';

interface TextFieldRef {
  ref: React.MutableRefObject<HTMLInputElement | null>;
  code: string;
}

const Home: React.FC = () => {
  const inputRefs = useRef<TextFieldRef[]>(Array.from({ length: 6 }, () => ({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ref: useRef<HTMLInputElement | null>(null),
    code: '',
  })));

  const handleInputChange = (index: number, value: string) => {
    const newInputRefs = [...inputRefs.current];
    newInputRefs[index].code = value;
    inputRefs.current = newInputRefs;

    if (value !== '' && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].ref.current?.focus();
    }
  };

  const handleSubmit = () => {
    const codes = inputRefs.current.map((inputRef) => inputRef.code);
    console.log('Submitted codes:', codes);

    
  };

  useEffect(() => {
    const handleFocus = (index: number) => {
      inputRefs.current[index].ref.current?.select();
    };

    inputRefs.current.forEach((_, index) => {
      const ref = inputRefs.current[index].ref.current;
      if (ref) {
        ref.addEventListener('focus', () => handleFocus(index));
      }
    });

    return () => {
      inputRefs.current.forEach((_, index) => {
        const ref = inputRefs.current[index].ref.current;
        if (ref) {
          ref.removeEventListener('focus', () => handleFocus(index));
        }
      });
    };
  }, []);

  return (
    <main>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
          padding: 4,
          border: '1px solid #ccc',
          borderRadius: 4,
          backgroundColor: '#f0f0f0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontFamily: "VT323" }}>
          Scavenger Hunt
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: "VT323" }}>CoE First Meet</Typography>

        <Typography variant="h6" sx={{ mt: 14 ,fontFamily: "Noto Sans Thai"}}>
          กรอกโค้ด
        </Typography>

        <FormControl
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
            gap: 0.4,
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: 1,
            backgroundColor: '#f0f0f0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {inputRefs.current.map((inputRef, index) => (
            <React.Fragment key={index}>
              <MUITextField
                variant="outlined"
                size="small"
                sx={{ width: 40 }}
                inputRef={inputRef.ref}
                onChange={(e) => handleInputChange(index, e.target.value)}
                autoFocus={index === 0}
              />
              {index !== inputRefs.current.length - 1 && index !== 3 && index !== 0 && index !== 2 && (
                <Typography variant="h6">-</Typography>
              )}
            </React.Fragment>
          ))}
        </FormControl>

        <Button variant="contained" sx={{ mt: 8, px: 4, borderRadius: 4, fontFamily: "Noto Sans Thai"}} onClick={handleSubmit}>
          ใช้โค้ด
        </Button>
      </Container>
    </main>
  );
};

export default Home;
