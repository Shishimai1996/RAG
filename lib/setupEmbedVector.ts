import { OpenAIEmbeddings } from "@langchain/openai";

export const embeddingVector = async (access_token: string) => {
  return new OpenAIEmbeddings({
    model: "text-embedding-3-large",
    apiKey: access_token,
    batchSize: 512,
    configuration: {
      baseURL: "",
      defaultHeaders: {
        "Wovey-Stargate-Project-ID": process.env.WOVEY_PROJECT_ID,
        // Authorization: `Bearer ${access_token}`,
      },
    },
  });
};
