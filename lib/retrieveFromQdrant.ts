import dotenv from "dotenv";
dotenv.config();

import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { embeddingVector } from "./setupEmbedVector";

export const prepareRetriever = async (woveyAccessKey: string) => {
  //create client to connect qdrant
  const qdrantClient = new QdrantClient({ url: process.env.QDRANT_URL });

  //get embedding model of text-embedding-3-large
  const embeddings = await embeddingVector(woveyAccessKey);

  //return vector store data
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      client: qdrantClient,
      collectionName: "my-docs",
    }
  );

  return vectorStore.asRetriever({ k: 10 });
};
