import { generateLlm } from "./setupLlm";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { prepareRetriever } from "./retrieveFromQdrant";
import { getWoveyAccess } from "./setupWoveyAccess";

export async function callLangchainModel(question: string) {
  //get Wovey Access key
  const woveyAccessKey = await getWoveyAccess();

  const retriever = await prepareRetriever(woveyAccessKey);
  //if you want to see the retrieved document, open the following lines.
  // const retrievedDocs = await retriever.invoke(question);
  // console.log(`🧠 Retrieved documents for question: "${question}"`);
  // retrievedDocs.forEach((doc, i) => {
  //   console.log(`\n[Document ${i + 1}]`);
  //   console.log(doc.pageContent);
  //   if (doc.metadata) {
  //     console.log("Metadata:", doc.metadata);
  //   }
  // });

  const isJapanese = /[ぁ-んァ-ン一-龥]/.test(question);
  const fallbackText = isJapanese
    ? "申し訳ありませんが、答えを見つけることができませんでした。"
    : "Sorry, I couldn't find an answer.";

  //create model and chain
  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a helpful assistant that answers the user's question using the context below.
    Use **only the provided context**. If the answer is partially available, answer accordingly.
    If you cannot answer anything at all from the context, then and only then say: "${fallbackText}"

    If the context already uses **Markdown formatting**, preserve it.
    Do not add extra numbering or reformat unless the context is unstructured.

Context:
{context}

Question: {input}`
  );

  const combineDocsChain = await createStuffDocumentsChain({
    llm: generateLlm(woveyAccessKey),
    prompt,
  });

  const chain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  const result = await chain.invoke({ input: question });
  console.log({ result });
  return result.answer;
}
