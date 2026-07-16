import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { Document } from "@langchain/core/documents";
import { QdrantClient } from "@qdrant/js-client-rest";

const COLLECTION_NAME = "my-docs";
const K = 10;

export const prepareRetriever = async (openAIApiKey: string) => {
  const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  const openai = new OpenAI({ apiKey: openAIApiKey });

  return {
    invoke: async (question: string): Promise<Document[]> => {
      // Use encoding_format: "float" to avoid the Buffer.buffer pool issue
      // that causes @langchain/openai to return 16384 garbage floats on Vercel
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question,
        encoding_format: "float",
      });

      const queryVector = embeddingResponse.data[0].embedding as number[];

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
