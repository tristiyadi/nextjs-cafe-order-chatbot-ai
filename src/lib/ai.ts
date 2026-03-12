import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

/**
 * Configuration from environment
 */
const API_KEY = process.env.LOCAL_LLM_API_KEY; // Presence of this key switches to OpenAI SDK
const BASE_URL = process.env.LOCAL_LLM_URL || "http://localhost:11434/v1";
const MODEL_NAME = process.env.LOCAL_LLM_MODEL || "llama3.2:1b";

// Optional OpenAI client (only used if API_KEY is defined)
let openai: OpenAI | null = null;
if (API_KEY && API_KEY !== "ollama") {
  openai = new OpenAI({
    baseURL: BASE_URL,
    apiKey: API_KEY,
  });
}

/**
 * Fetches popular items directly from the DB for the system prompt
 */
async function getPopularMenuContext() {
  try {
    const popularItems = await db.query.menuItems.findMany({
      where: eq(menuItems.isPopular, true),
      limit: 5,
    });

    if (!popularItems.length) return "";

    return `\nMENU POPULER KAMI:\n${popularItems
      .map(
        (item) =>
          `- ${item.name} (Rp${parseFloat(item.price).toLocaleString("id-ID")}): ${item.description}`,
      )
      .join("\n")}`;
  } catch (err) {
    console.error("Failed to fetch popular menu for context:", err);
    return "";
  }
}

export async function getChatResponse(
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  currentMessage: string,
  searchContext: string,
) {
  const popularContext = await getPopularMenuContext();

  const systemPrompt = `Anda adalah Kafi, barista Kafe Nusantara.
Gunakan data menu di bawah ini untuk menjawab secara ramah dan singkat.

MENU KAMI:
${popularContext}

${searchContext ? `PENCARIAN RELEVAN:\n${searchContext}` : ""}

ATURAN:
1. Berbahasa Indonesia ramah dan santai.
2. Jawab sesuai kategori yang diminta (misal: jika tanya 'minuman', jangan sebut 'makanan/snack').
3. Kamu WAJIB menuliskan harga di samping nama menu (Contoh: Nama Menu (Rp10.000)).
4. Gunakan daftar bullet (-) untuk menu baru dan berikan deskripsi singkat.
5. Jika tidak ada di data, katakan tidak tersedia.

CONTOH FORMAT:
- Nama Menu (Rp18.000): Deskripsi.`;
console.log("systemPrompt: ", systemPrompt)
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({
      role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: m.parts[0].text,
    })),
    { role: "user", content: currentMessage },
  ];

  // SWITCHING LOGIC
  if (openai) {
    // --- APPROACH 1: OpenAI SDK (Active when API_KEY is present) ---
    try {
      const response = await openai.chat.completions.create({
        model: MODEL_NAME,
        messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: 0.6,
        max_tokens: 500,
      });

      return (
        response.choices[0]?.message?.content || "Maaf, Kafi bingung sebentar."
      );
    } catch (error) {
      console.error("SDK AI Error:", error);
    }
  }

  // --- APPROACH 2: Native Ollama API (Default / No API Key) ---
  try {
    // Clean URL for native endpoint (strip /v1)
    const nativeHost = BASE_URL.replace("/v1", "");
    const response = await fetch(`${nativeHost}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages,
        stream: false,
      }),
    });

    if (!response.ok)
      throw new Error(`Ollama fetch failed: ${response.statusText}`);

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.error("Native Ollama Error:", error);
    return "Maaf, Kafi sedang mengalami kendala teknis. Mohon coba beberapa saat lagi.";
  }
}
