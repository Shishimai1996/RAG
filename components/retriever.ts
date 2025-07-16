import { loadMarkdown } from "./loadMarkdown";
import { Document } from "@langchain/core/documents";
import { splitMarkdownByHeadings } from "./splitMarkdownByHeadings";

export type TMarkdownMetadata = {
  loc: {
    lines: {
      from: number;
      to: number;
    };
  };
  source?: string;
  title?: string;
};

export type TMarkdownDocument = Document<TMarkdownMetadata>;

// read docs + split in chunks + embed to vector
export const getRetrieverFromMarkdown = async (): Promise<
  TMarkdownDocument[]
> => {
  const markdown = loadMarkdown();
  const docs = splitMarkdownByHeadings(markdown);
  return docs as TMarkdownDocument[];
};
