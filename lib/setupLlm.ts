import { ChatOpenAI } from "@langchain/openai";

export const generateLlm = (apiKey: string) => {
  return new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey,
    temperature: 0.3,
    streaming: false,
  });
};
