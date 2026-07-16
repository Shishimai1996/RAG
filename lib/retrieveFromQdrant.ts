import dotenv from "dotenv";
dotenv.config();

import { Document } from "@langchain/core/documents";
import { QdrantClient } from "@qdrant/js-client-rest";
import { embeddingVector } from "./setupEmbedVector";

const COLLECTION_NAME = "my-docs";
const K = 10;

export const prepareRetriever = async (openAIApiKey: string) => {
  const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  const embeddings = await embeddingVector(openAIApiKey);

  return {
    invoke: async (question: string): Promise<Document[]> => {
      const rawVector = await embeddings.embedQuery(question);
      const queryVector = Array.from(rawVector);
      console.log("vector constructor:", (rawVector as unknown as object).constructor?.name, "isArray:", Array.isArray(rawVector), "len:", rawVector.length, "sample:", JSON.stringify(queryVector.slice(0, 2)));
      const results = await qdrantClient.search(COLLECTION_NAME, {
        vector: queryVector,
        limit: K,
        with_payload: ["metadata", "content"],
        with_vector: false,
      });

      return results.map(
        (r) =>
          new Document({
            pageContent: (r.payload?.content as string) ?? "",
            metadata: (r.payload?.metadata as Record<string, unknown>) ?? {},
          }),
      );
    },
  };
};
