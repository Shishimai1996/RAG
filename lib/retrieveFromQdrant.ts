import dotenv from "dotenv";
dotenv.config();

import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { embeddingVector } from "./setupEmbedVector";

export const prepareRetriever = async (openAIApiKey: string) => {
  //create client to connect qdrant
  const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  //get embedding model of text-embedding-3-small
  const embeddings = await embeddingVector(openAIApiKey);

  //return vector store data
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      client: qdrantClient,
      collectionName: "my-docs",
    },
  );

  return vectorStore.asRetriever({ k: 10 });
};
