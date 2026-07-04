import dotenv from "dotenv";
dotenv.config();

export const getOpenAIApiKey = async () => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Set it in your environment.");
  }

  return apiKey;
};
