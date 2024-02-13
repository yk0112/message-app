"use client";

import React, { createContext, useContext, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface LoadingModalProps {
  children: React.ReactNode;
}

export const ModalContext = createContext({
  isLMOpen: false,
  openLM: () => {},
  closeLM: () => {},
});

const LoadingModal = ({ children }: LoadingModalProps) => {
  const [isLMOpen, setIsLMOpen] = useState(false);
  const openLM = () => setIsLMOpen(true);
  const closeLM = () => setIsLMOpen(false);

  return (
    <ModalContext.Provider value={{ isLMOpen, openLM, closeLM }}>
      <Backdrop
        sx={{ color: "#00ff7f", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLMOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </ModalContext.Provider>
  );
};

export default LoadingModal;
