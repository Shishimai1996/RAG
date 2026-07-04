import { OpenAIEmbeddings } from "@langchain/openai";

export const embeddingVector = async (apiKey: string) => {
  return new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey,
    batchSize: 512,
  });
};
