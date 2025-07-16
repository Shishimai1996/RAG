import { embedDocuments } from "@/lib/embedDocuments";
import { getWoveyAccess } from "@/lib/setupWoveyAccess";

async function run() {
  const woveyAccessKey = await getWoveyAccess();

  await embedDocuments(woveyAccessKey);

  console.log("✅ Embedded Markdown to Qdrant!");
}

run();
