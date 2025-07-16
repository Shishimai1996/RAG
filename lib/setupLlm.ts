import { ChatOpenAI } from "@langchain/openai";

export const generateLlm = (access_token: string) => {
  return new ChatOpenAI({
    model: "gpt-4o",
    apiKey: access_token,
    configuration: {
      baseURL: "",
      defaultHeaders: {
        "Wovey-Stargate-Project-ID": process.env.WOVEY_PROJECT_ID,
      },
    },
    temperature: 0.3,
    streaming: false,
  });
};
