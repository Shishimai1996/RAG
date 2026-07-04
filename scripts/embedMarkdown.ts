import { embedDocuments } from "@/lib/embedDocuments";
import { getOpenAIApiKey } from "@/lib/setupWoveyAccess";

async function run() {
  const openAIApiKey = await getOpenAIApiKey();

  await embedDocuments(openAIApiKey);

  console.log("✅ Embedded Markdown to Qdrant!");
}

run();
