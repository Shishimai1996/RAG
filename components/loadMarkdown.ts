import path from "path";
import fs from "fs";

export const loadMarkdown = () => {
  //read markdown file
  const markdownDir = path.join(process.cwd(), "data");
  const files: string[] = fs.readdirSync(markdownDir);

  const markdownContents = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(markdownDir, file);
      return fs.readFileSync(filePath, "utf-8");
    });

  //convert to one string
  return markdownContents.join("\n\n---\n\n");
};
