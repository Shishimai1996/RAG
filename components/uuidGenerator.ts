import uuidByString from "uuid-by-string";
import { TMarkdownDocument, TMarkdownMetadata } from "./retriever";

type TDocumentWithId = TMarkdownDocument & {
  id: string;
  metadata: TMarkdownMetadata & { id: string };
};

export const uuidGenerator = (input: TMarkdownDocument[]): TDocumentWithId[] => {
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
