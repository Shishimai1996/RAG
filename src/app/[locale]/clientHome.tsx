"use client";

import { GradientCircularProgress } from "@/components/GradientCircularProgress";
import {
  Box,
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import styles from "../../../styles/Home.module.css";
import { useTranslations } from "use-intl";
import { LocaleSwitcherButton } from "@/components/localeSwitcherButton";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const textQueue = useRef<string>("");
  const [isStreamingDone, setIsStreamingDone] = useState(false);

  const t = useTranslations();

  useEffect(() => {
    if (!isStreamingDone || textQueue.current.length === 0) return;

    const textArray = Array.from(textQueue.current);
    const indexRef = { current: 0 };

    const interval = setInterval(() => {
      const currentChar = textArray[indexRef.current];
      if (typeof currentChar !== "undefined") {
        setDisplayedText((prev) => {
          const updated = prev + currentChar;
          return updated;
        });
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isStreamingDone]);

  //Step1: get the user's question and send the request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setDisplayedText("");
      setError(t("errorEmptyQuestion"));
      return;
    }
    setDisplayedText("");
    setLoading(true);
    textQueue.current = "";
    setIsStreamingDone(false);
    setError(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok || !response.body) {
        setError(t("errorTryAgain"));
        setLoading(false);
        return;
      }
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const formattedChunk = chunk
            .replace(/(?<!\n)(\d+\.\s)/g, "\n$1")
            .replace(/(?<!\n)(#{2,3}\s)/g, "\n$1");
          setDisplayedText((prev) => prev + formattedChunk);
        }
      }

      setIsStreamingDone(true);
    } catch (error) {
      console.error(error);
      setError(t("errorTryAgain"));
    }
    setLoading(false);
  };

  return (
    <>
      <div className={styles.page}>
        <LocaleSwitcherButton />
        <main className={styles.main}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: "30px", sm: "36px", md: "40px" } }}
            >
              {t("askQ")}
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              autoComplete="off"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                width: { xs: "300px", sm: "500px", md: "700px" },
                maxWidth: "700px",
                mt: 3,
              }}
            >
              <TextField
                fullWidth
                id="outlined"
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                label={t("questionField")}
                slotProps={{
                  input: {
                    sx: {
                      fontSize: { xs: "16px", sm: "18px", md: "20px" },
                    },
                  },
                  inputLabel: {
                    sx: {
                      fontSize: { xs: "14px", sm: "16px", md: "18px" },
                    },
                  },
                }}
                sx={{
                  bgcolor: "#faf9f9b7",
                  borderRadius: "12px",
                  flexGrow: 1,
                  "&> :not(style)": {
                    m: 0.5,
                    width: "95%",
                    height: "4.5ch",
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "60px",
                  height: "60px",
                  padding: 0,
                  bgcolor: "#252323",
                  color: "#fff",
                  borderRadius: "12px",
                  border: loading ? "none" : "0.01px solid #ffffffae",
                  boxShadow: "4px 6px 12px rgba(0,118,255,0.39)",
                  fontSize: { xs: "16px", sm: "18px", md: "20px" },
                  textTransform: "none",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    bgcolor: "#727986",
                    transform: "translateY(-2px)",
                    boxShadow: "6px 8px 16px rgba(0,118,255,0.5)",
                  },
                }}
              >
                {loading ? (
                  <GradientCircularProgress />
                ) : (
                  <IoSend color="#04f6fa" size="30" />
                )}
              </Button>
            </Box>

            {displayedText && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px",
                  minHeight: "50vh",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#22212146",
                    borderRadius: "12px",
                    padding: { xs: "16px", sm: "24px 32px" },
                    maxWidth: "700px",
                    width: { xs: "300px", sm: "500px", md: "700px" },
                    boxShadow: "0 4px 20px rgba(227, 214, 214, 0.508)",
                    fontSize: { xs: "16px", sm: "18px", md: "20px" },
                    color: "#fbf9f9d0",
                    lineHeight: 1.6,
                  }}
                >
                  <Typography variant="h5">{t("answer")}</Typography>
                  {isStreamingDone ? (
                    <ReactMarkdown
                      components={{
                        h2: (props) => (
                          <Typography variant="h5" gutterBottom {...props} />
                        ),
                        p: (props) => (
                          <Typography
                            variant="h6"
                            component="p"
                            gutterBottom
                            {...props}
                          />
                        ),
                        ul: ({ children }) => (
                          <List
                            component="ul"
                            sx={{ pl: 4, listStyleType: "disc" }}
                          >
                            {children}
                          </List>
                        ),
                        li: ({ children }) => (
                          <ListItem sx={{ display: "list-item", pl: 1 }}>
                            {children}
                          </ListItem>
                        ),
                      }}
                    >
                      {displayedText}
                    </ReactMarkdown>
                  ) : (
                    <Box sx={{ marginTop: "10px", position: "relative" }}>
                      {displayedText.split("\n").map((line, index) => (
                        <span key={index} className={styles.typing}>
                          {line}
                        </span>
                      ))}

                      {!isStreamingDone && (
                        <span className={styles.cursor}>|</span>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            {error && (
              <Box sx={{ mt: "20px" }}>
                <Typography variant="body1" color="red">
                  {error}
                </Typography>
              </Box>
            )}
          </Box>
        </main>
      </div>
    </>
  );
}
