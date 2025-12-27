import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  textNodeName: "#text",
  cdataPropName: "__cdata",
});

const xmlContent = readFileSync(join(__dirname, "./export.xml"), "utf-8");
const result = parser.parse(xmlContent);

console.log("Keys in result:", Object.keys(result));
console.log("Keys in rss:", Object.keys(result.rss));
console.log("Keys in channel:", Object.keys(result.rss.channel));
console.log("Type of item:", typeof result.rss.channel.item);
console.log("Item value:", result.rss.channel.item);
