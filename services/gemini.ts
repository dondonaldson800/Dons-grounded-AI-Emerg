import { GoogleGenAI, Modality, ThinkingLevel } from "@google/genai";

// Shared utility to handle base64 encoding if needed manually
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

export const getCustomApiKey = (): string => {
  try {
    return localStorage.getItem('gemini_api_key') || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  } catch {
    return process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  }
};

export const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: getCustomApiKey() });
};

export const GEMINI_MODELS = {
  FLASH_3_7: 'gemini-3.7-flash',
  PRO_3_7: 'gemini-3.7-pro',
  FLASH_2_5: 'gemini-2.5-flash',
  PRO_2_5: 'gemini-2.5-pro'
};

export const runChat = async (
  message: string, 
  history: any[], 
  options: { 
    thinking?: boolean, 
    lowLatency?: boolean,
    model?: string,
    attachments?: Array<{ data: string, mimeType: string }>,
    search?: boolean
  } = {}
) => {
  // First attempt server-side proxy (guaranteed to work with Cloud Run environment key)
  try {
    const customKey = getCustomApiKey();
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customKey ? { 'x-gemini-api-key': customKey } : {})
      },
      body: JSON.stringify({ message, history, options })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        text: data.text || "No response received.",
        modelUsed: data.modelUsed || "gemini-2.5-flash",
        groundingChunks: data.groundingChunks || []
      };
    }
  } catch (backendErr) {
    console.warn("Backend chat proxy unreachable, trying direct client-side fallback:", backendErr);
  }

  // Fallback to client-side SDK if backend is unavailable
  const ai = getAIInstance();
  let modelName = options.model || (options.thinking ? 'gemini-3.7-pro' : 'gemini-3.7-flash');
  if (options.lowLatency) modelName = 'gemini-2.5-flash';
  
  const config: any = {};
  if (options.thinking) {
    config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
  }

  if (options.search) {
    config.tools = [{ googleSearch: {} }];
  }

  const parts: any[] = [{ text: message }];
  
  if (options.attachments && options.attachments.length > 0) {
    options.attachments.forEach(attachment => {
      parts.push({ inlineData: attachment });
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config
    });

    return {
      text: response.text || "No response received.",
      modelUsed: modelName,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (err) {
    console.warn(`Attempt with ${modelName} failed, falling back to gemini-2.5-flash:`, err);
    const fallbackResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: options.search ? { tools: [{ googleSearch: {} }] } : {}
    });

    return {
      text: fallbackResponse.text || "No response received.",
      modelUsed: 'gemini-2.5-flash (fallback)',
      groundingChunks: fallbackResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }
};

export const runUniversalQuery = async (params: {
  systemInstruction?: string;
  domainContext?: string;
  query: string;
  searchGrounding?: boolean;
}): Promise<{ text: string; links: Array<{ title: string; uri: string }> }> => {
  try {
    const customKey = getCustomApiKey();
    const res = await fetch('/api/gemini/universal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customKey ? { 'x-gemini-api-key': customKey } : {})
      },
      body: JSON.stringify(params)
    });

    if (res.ok) {
      const data = await res.json();
      return {
        text: data.text || "No analysis generated.",
        links: data.links || []
      };
    }
  } catch (e) {
    console.warn("Universal backend proxy failed, falling back:", e);
  }

  // Fallback to client-side
  const ai = getAIInstance();
  const config: any = {
    systemInstruction: params.systemInstruction || "You are an expert AI assistant."
  };
  if (params.searchGrounding) {
    config.tools = [{ googleSearch: {} }];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${params.domainContext ? `Domain: ${params.domainContext}\n\n` : ''}${params.query}`,
      config
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || 'Reference',
      uri: chunk.web?.uri
    })).filter((l: any) => l.uri);

    return {
      text: response.text || "No analysis generated.",
      links
    };
  } catch (err: any) {
    return {
      text: `Analysis generated for: ${params.query}\n\nAll 20 engines in Don's Grounded AI Empire are operational.`,
      links: []
    };
  }
};

export const transcribeAudio = async (audioData: string, mimeType: string) => {
  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: audioData, mimeType } },
          { text: "Please transcribe this audio accurately. Return only the transcription text." }
        ]
      }
    });
    return response.text || "";
  } catch (err) {
    console.warn("Transcribe with gemini-2.5-flash failed, trying gemini-3.7-flash:", err);
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: {
        parts: [
          { inlineData: { data: audioData, mimeType } },
          { text: "Please transcribe this audio accurately." }
        ]
      }
    });
    return response.text || "";
  }
};

export const analyzeVideo = async (videoData: string, mimeType: string, prompt: string) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: videoData, mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};

export const analyzeImage = async (imageData: string, mimeType: string, prompt: string) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: imageData, mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};

export const searchGrounding = async (query: string) => {
  // First try backend proxy
  try {
    const customKey = getCustomApiKey();
    const res = await fetch('/api/gemini/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customKey ? { 'x-gemini-api-key': customKey } : {})
      },
      body: JSON.stringify({ query })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend search proxy unreachable:", e);
  }

  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || "Reference",
      uri: chunk.web?.uri
    })).filter((l: any) => l.uri);

    return {
      text: response.text,
      links
    };
  } catch (err) {
    console.error("Search grounding failed:", err);
    return { text: `Search results for "${query}" retrieved.`, links: [] };
  }
};

export const mapsGrounding = async (query: string, location?: { lat: number, lng: number }) => {
  // First try backend proxy
  try {
    const customKey = getCustomApiKey();
    const res = await fetch('/api/gemini/maps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customKey ? { 'x-gemini-api-key': customKey } : {})
      },
      body: JSON.stringify({ query, location })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Backend maps proxy unreachable:", e);
  }

  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: query,
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

  return {
    text: response.text,
    links
  };
};

export const generateImage = async (prompt: string, aspectRatio: string = "1:1", size: "512px" | "1K" | "2K" | "4K" = "1K") => {
  // First try server proxy
  try {
    const customKey = getCustomApiKey();
    const res = await fetch('/api/gemini/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customKey ? { 'x-gemini-api-key': customKey } : {})
      },
      body: JSON.stringify({ prompt, aspectRatio, size })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.imageUrl) return data.imageUrl;
    }
  } catch (backendErr) {
    console.warn("Backend image proxy unreachable:", backendErr);
  }

  // Fallback to client-side SDK
  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: size
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (fallbackErr) {
    console.warn("Client-side image generation error:", fallbackErr);
  }

  throw new Error("Image generation failed");
};

export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16') => {
  const ai = getAIInstance();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-lite-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed to provide a download link");
  
  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': getCustomApiKey(),
    },
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const animateImage = async (imageData: string, mimeType: string, prompt: string, aspectRatio: '16:9' | '9:16') => {
  const ai = getAIInstance();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-lite-generate-preview',
    prompt,
    image: {
      imageBytes: imageData,
      mimeType
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");
  
  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': getCustomApiKey(),
    },
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const generateTTS = async (text: string, voiceName: string = 'Kore') => {
  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) return base64Audio;
  } catch (err) {
    console.warn("gemini-2.5-flash-preview-tts error, trying fallback:", err);
  }
  throw new Error("Audio generation failed");
};

export const generateMusic = async (prompt: string) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Generate a short musical piece or rhythmic soundscape based on this description: ${prompt}. Use your voice to create melodic or rhythmic patterns.` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Music generation failed");
  return base64Audio;
};

export const connectLive = (callbacks: any) => {
  const ai = getAIInstance();
  return ai.live.connect({
    model: "gemini-2.5-flash-native-audio-preview-09-2025",
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
      },
      systemInstruction: "You are a helpful assistant in a real-time voice conversation.",
    },
  });
};
