import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("📩 Prompt:", prompt);
    console.log("🔑 API:", process.env.GEMINI_KEY ? "Loaded ✅" : "Missing ❌");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    console.log("📡 Status:", response.status);

    const data = await response.json();
    console.log("🧠 Response:", JSON.stringify(data, null, 2));

    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts.map(p => p.text).join("");

    res.json({
      content: [{ text: text || "AI failed 😅" }]
    });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({
      content: [{ text: "Server error 😢" }]
    });
  }
});

app.listen(3000, () => {
  console.log("🔥 Server running at http://127.0.0.1:3000");
});