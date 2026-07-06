import dotenv from "dotenv";
dotenv.config();

import { getRetrieverFromMarkdown } from "@/components/retriever";
import { embeddingVector } from "./setupEmbedVector";
import { QdrantClient } from "@qdrant/js-client-rest";
import { uuidGenerator } from "@/components/uuidGenerator";
import { QdrantVectorStore } from "@langchain/qdrant";

const COLLECTION_NAME = "my-docs";

export const embedDocuments = async (openAIApiKey: string) => {
  const allDocs = await getRetrieverFromMarkdown();
  //get embedding model of text-embedding-3-small
  const embeddings = await embeddingVector(openAIApiKey);
  //create client to connect qdrant
  const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  //if you want to delete data from database.
  // await qdrantClient.delete(COLLECTION_NAME, {
  //   filter: {},
  // });
  // console.log("🧹 Qdrant: delete all data！");

  const newDocsWithIds = await uuidGenerator(allDocs);

  //see if database already has my-docs vectors.
  const collections = await qdrantClient.getCollections();
  const exists = collections.collections.some(
    (col) => col.name === COLLECTION_NAME,
  );

  if (exists) {
    //get id list from qdrant data that is already registered
    const existingIds = new Set<string>();

    const scrollRes = await qdrantClient.scroll(COLLECTION_NAME, {
      limit: 10000,
      with_payload: true,
    });

    scrollRes.points?.forEach((point) => {
      if (typeof point.id === "string") {
        existingIds.add(point.id);
      }
    });
    console.log("✅ existingIds:", [...existingIds]);

    //check if there is new one
    const newOnly = newDocsWithIds.filter(
      (doc) => !existingIds.has(doc.metadata.id),
    );

    console.log(`📦 Filtered ${newOnly?.length} new documents.`);

    //if there is new one, add newOnly to vector store
    if (newOnly && newOnly?.length > 0) {
      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          client: qdrantClient,
          collectionName: COLLECTION_NAME,
        },
      );
      await vectorStore.addDocuments(newOnly, {
        ids: newOnly.map((docs) => docs.metadata.id),
      });
      console.log(`✅ Added ${newOnly.length} new documents.`);
    } else {
      console.log("there is no new documents");
    }
  } else {
    console.log("🆕 No collection found. Creating new one from markdown...");

    //if there is no data in qdrant, embedding vector and add it to my-docs
    await QdrantVectorStore.fromDocuments(newDocsWithIds, embeddings, {
      client: qdrantClient,
      collectionName: "my-docs",
    });
  }
};
