import { Document } from "@langchain/core/documents";
import { TMarkdownMetadata } from "./retriever";

export const splitMarkdownByHeadings = (
  markdown: string
): Document<TMarkdownMetadata>[] => {
  //chunk by pages
  const pages = markdown.split(/^\s*[-]{3,}\s*$/gm);

  const chunks: string[] = [];

  //divide each pages by paragraph
  for (const page of pages) {
    const lines = page.split("\n");
    const sections: string[] = [];
    let buffer: string[] = [];
    let parentHeaders: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      //if find ### or ####, add to buffer[]
      if (/^###\s/.test(line) || /^####\s/.test(line)) {
        if (buffer.length > 0) {
          const content = [...parentHeaders, ...buffer].join("\n");

          sections.push(content);
        }
        buffer = [line];
        //if there are # and ##, add to parentHeaders as a title
      } else if (/^##\s/.test(line) || /^#\s/.test(line)) {
        parentHeaders = [line];
      } else {
        buffer.push(line);
      }
    }
    // join parentHeaders and buffer
    if (buffer.length > 0) {
      const content = [...parentHeaders, ...buffer].join("\n");

      sections.push(content);
    }
    chunks.push(...sections);
  }
  const docs = chunks
    .filter((chunk) => chunk.trim() !== "")
    .map((chunk) => {
      return new Document<TMarkdownMetadata>({
        pageContent: chunk,
        metadata: {
          loc: {
            lines: {
              from: 0,
              to: 0,
            },
          },
          title: chunk.match(/^#{1,4} .*$/m)?.[0] ?? "undefined",
        },
      });
    });
  return docs;
};
