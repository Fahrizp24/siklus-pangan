import fs from "node:fs";
import { GoogleGenAI, Type } from "@google/genai";

const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => l.includes("=") && !l.trim().startsWith("#")).map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
if (!env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: "Jawab status layanan.",
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: { status: { type: Type.STRING } },
      required: ["status"],
    },
  },
});
const data = JSON.parse(response.text ?? "{}");
if (typeof data.status !== "string" || !data.status) throw new Error("Structured output invalid");
console.log("Gemini structured output: PASS");
