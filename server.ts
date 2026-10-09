import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAIClient(customKey?: string) {
  const apiKey = customKey || process.env.GEMINI_API_KEY || process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Body parser with 50mb limit for multimodal images & audio
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Serve static files from public directory
  app.use(express.static("public"));

  // API Health & Status
  app.get("/api/health", (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY);
    res.json({ 
      status: "ok", 
      message: "Don's Empire Backend is Live",
      geminiConfigured: hasKey,
      envKeys: Object.keys(process.env).filter(k => k.includes('EXPO') || k.includes('GEMINI') || k.includes('API_KEY'))
    });
  });

  app.get("/api/gemini/status", (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY);
    res.json({ configured: hasKey });
  });

  // Server-side Gemini Chat Proxy
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const customKey = (req.headers["x-gemini-api-key"] as string) || "";
      const ai = getAIClient(customKey);
      const { message, history, options = {} } = req.body;

      let modelName = options.model || (options.thinking ? "gemini-3.1-pro-preview" : "gemini-2.5-flash");
      if (options.lowLatency) modelName = "gemini-2.5-flash";

      const config: any = {};
      if (options.thinking) {
        config.thinkingConfig = { thinkingLevel: "HIGH" };
      }
      if (options.search) {
        config.tools = [{ googleSearch: {} }];
      }

      const parts: any[] = [{ text: message || "Hello" }];
      if (options.attachments && Array.isArray(options.attachments)) {
        options.attachments.forEach((att: any) => {
          if (att.data && att.mimeType) {
            parts.push({ inlineData: { data: att.data, mimeType: att.mimeType } });
          }
        });
      }

      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts },
          config
        });

        res.json({
          text: response.text || "No response received.",
          modelUsed: modelName,
          groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
        });
      } catch (primaryErr: any) {
        console.warn(`Primary chat with ${modelName} failed, retrying with gemini-2.5-flash:`, primaryErr?.message);
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: { parts },
          config: options.search ? { tools: [{ googleSearch: {} }] } : {}
        });

        res.json({
          text: fallbackResponse.text || "No response received.",
          modelUsed: "gemini-2.5-flash (fallback)",
          groundingChunks: fallbackResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || []
        });
      }
    } catch (err: any) {
      console.error("Chat error in server:", err);
      res.status(500).json({ error: err?.message || "Failed to generate chat response" });
    }
  });

  // Server-side Universal Empire Tools (For all 20 apps)
  app.post("/api/gemini/universal", async (req, res) => {
    try {
      const customKey = (req.headers["x-gemini-api-key"] as string) || "";
      const ai = getAIClient(customKey);
      const { systemInstruction, domainContext, query, searchGrounding } = req.body;

      const config: any = {
        systemInstruction: systemInstruction || "You are an expert AI assistant."
      };
      if (searchGrounding) {
        config.tools = [{ googleSearch: {} }];
      }

      const contents = `${domainContext ? `Domain: ${domainContext}\n\n` : ""}${query || ""}`;

      let responseText = "";
      let links: any[] = [];

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents,
          config
        });
        responseText = response.text || "No analysis generated.";
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        links = groundingChunks.map((chunk: any) => ({
          title: chunk.web?.title || "Reference",
          uri: chunk.web?.uri
        })).filter((l: any) => l.uri);
      } catch (err: any) {
        console.warn("Universal prompt retry:", err?.message);
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents,
          config: {}
        });
        responseText = response.text || "No analysis generated.";
      }

      res.json({ text: responseText, links });
    } catch (err: any) {
      console.error("Universal app generation error in server:", err);
      res.status(500).json({ error: err?.message || "Generation error" });
    }
  });

  // Server-side Image Generator
  app.post("/api/gemini/image", async (req, res) => {
    try {
      const customKey = (req.headers["x-gemini-api-key"] as string) || "";
      const ai = getAIClient(customKey);
      const { prompt, aspectRatio = "1:1", size = "1K" } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-image",
          contents: { parts: [{ text: prompt }] },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
              imageSize: size as any
            }
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            return res.json({ imageUrl: `data:image/png;base64,${part.inlineData.data}` });
          }
        }
        throw new Error("No image data returned from model");
      } catch (primaryErr: any) {
        console.warn("gemini-3.1-flash-image failed, trying gemini-3.1-flash-lite-image:", primaryErr?.message);
        const fallback = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: { parts: [{ text: prompt }] }
        });
        for (const part of fallback.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            return res.json({ imageUrl: `data:image/png;base64,${part.inlineData.data}` });
          }
        }
        throw primaryErr;
      }
    } catch (err: any) {
      console.error("Image generation error in server:", err);
      res.status(500).json({ error: err?.message || "Failed to generate image" });
    }
  });

  // Server-side Search Grounding
  app.post("/api/gemini/search", async (req, res) => {
    try {
      const customKey = (req.headers["x-gemini-api-key"] as string) || "";
      const ai = getAIClient(customKey);
      const { query } = req.body;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query || "Trending tech news",
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = groundingChunks.map((chunk: any) => ({
        title: chunk.web?.title || "Reference",
        uri: chunk.web?.uri
      })).filter((l: any) => l.uri);

      res.json({
        text: response.text || "",
        links
      });
    } catch (err: any) {
      console.error("Search grounding error:", err);
      res.status(500).json({ error: err?.message || "Failed to search" });
    }
  });

  // Server-side Maps Grounding
  app.post("/api/gemini/maps", async (req, res) => {
    try {
      const customKey = (req.headers["x-gemini-api-key"] as string) || "";
      const ai = getAIClient(customKey);
      const { query, location } = req.body;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query || "Find places nearby",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: location ? {
            retrievalConfig: {
              latLng: {
                latitude: location.lat,
                longitude: location.lng
              }
            }
          } : undefined
        }
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = groundingChunks.map((chunk: any) => ({
        title: chunk.maps?.title || "Place",
        uri: chunk.maps?.uri
      })).filter((l: any) => l.uri);

      res.json({
        text: response.text || "",
        links
      });
    } catch (err: any) {
      console.error("Maps grounding error:", err);
      res.status(500).json({ error: err?.message || "Failed to search maps" });
    }
  });

  // EAS Build Trigger
  app.post("/api/build", (req, res) => {
    console.log("Triggering EAS Build...");
    const token = process.env.EXPO_TOKEN;
    if (!token) {
      return res.status(400).json({ error: "EXPO_TOKEN not found in server environment" });
    }
    exec(`EXPO_TOKEN=${token} npx eas build --platform android --profile preview --non-interactive > build.log 2>&1`, (error) => {
      if (error) {
        console.error(`Build error: ${error.message}`);
      }
    });

    res.json({ status: "Build triggered", logFile: "/build.log" });
  });

  // Empire stats
  app.get("/api/empire/stats", (req, res) => {
    res.json({
      totalUsers: 1250,
      activeNodes: 42,
      empireValue: "1.2B Credits"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Don's Empire Server running on http://localhost:${PORT}`);
  });
}

startServer();
