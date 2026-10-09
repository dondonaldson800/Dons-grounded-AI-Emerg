import { GoogleGenAI } from "@google/genai";

export const generateLogo = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: "A majestic, modern minimalist logo for 'Don's AI Empire'. A stylized golden crown integrated with a glowing blue neural network circuit pattern. The design is centered on a deep obsidian background. Professional, high-tech, premium, vector art style, clean lines, symmetrical.",
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
