import { generateLlm } from "./setupLlm";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { prepareRetriever } from "./retrieveFromQdrant";
import { getOpenAIApiKey } from "./setupWoveyAccess";

export async function callLangchainModel(question: string) {
  const openAIApiKey = await getOpenAIApiKey();

  const retriever = await prepareRetriever(openAIApiKey);
  const retrievedDocs = await retriever.invoke(question);
  console.log(`🧠 Retrieved documents for question: "${question}"`);
  console.log(`📊 Found ${retrievedDocs.length} documents`);

  const isJapanese = /[ぁ-んァ-ン一-龥]/.test(question);
  const fallbackText = isJapanese
    ? "申し訳ありませんが、答えを見つけることができませんでした。"
    : "Sorry, I couldn't find an answer.";

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a helpful assistant that answers the user's question using the context below.
    Use **only the provided context**. If the answer is partially available, answer accordingly.
    If you cannot answer anything at all from the context, then and only then say: "${fallbackText}"

    If the context already uses **Markdown formatting**, preserve it.
    Do not add extra numbering or reformat unless the context is unstructured.

Context:
{context}

Question: {input}`,
  );

  const combineDocsChain = await createStuffDocumentsChain({
    llm: generateLlm(openAIApiKey),
    prompt,
  });

  const answer = await combineDocsChain.invoke({
    input: question,
    context: retrievedDocs,
  });

  return answer;
}
