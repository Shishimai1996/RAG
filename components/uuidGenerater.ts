import uuidByString from "uuid-by-string";
import { TMarkdownDocument } from "./retriever";

export const uuidGenerater = (input: TMarkdownDocument[]) => {
  //add unique id as uuid for each document and give it to matadata
  const newDocsWithIds = input.map((input) => {
    const id = uuidByString(input.pageContent);
    return {
      ...input,
      id,
      metadata: { ...input.metadata, id },
    };
  });
  console.log(
    "🆕 new incoming IDs:",
    newDocsWithIds?.map((input) => input.metadata.id)
  );
  return newDocsWithIds;
};
