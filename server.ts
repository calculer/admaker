import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const ARGON_MODEL_ID = 'gemini-4-argon';
const IMAGE_MODEL_ID = 'gemini-3.1-flash-lite-image';

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function classifyGeminiError(err: unknown, modelId: string): {
  code: string;
  setupMessage: string;
  rawMessage: string;
} {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const lower = rawMessage.toLowerCase();

  if (
    lower.includes('403') ||
    lower.includes('permission_denied') ||
    lower.includes('api_key_invalid') ||
    lower.includes('400') ||
    lower.includes('not found') ||
    lower.includes('404') ||
    lower.includes('429') ||
    lower.includes('resource_exhausted') ||
    lower.includes('billing')
  ) {
    return {
      code: 'MODEL_ACCESS_OR_BILLING_REQUIRED',
      setupMessage: `Model "${modelId}" could not be accessed with the current environment credentials. Please attach a billing-enabled API key in the AI Studio Settings > Secrets panel to enable live ${modelId} generation.`,
      rawMessage,
    };
  }

  return {
    code: 'MODEL_UNAVAILABLE',
    setupMessage: `Could not reach "${modelId}". Verify your API key in Settings > Secrets or retry shortly.`,
    rawMessage,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // Health & Model Configuration Check Endpoint
  app.get('/api/studio/status', async (_req, res) => {
    const ai = getAiClient();
    res.json({
      configuredCoreModel: ARGON_MODEL_ID,
      configuredImageModel: IMAGE_MODEL_ID,
      hasServerKey: Boolean(ai),
    });
  });

  // 1. Campaign Reasoning, Cultural Adaptation, Multilingual Copy & Image Prompt Planning via gemini-4-argon
  app.post('/api/campaign/argon-plan', async (req, res) => {
    const ai = getAiClient();
    if (!ai) {
      res.status(200).json({
        argonAvailable: false,
        modelId: ARGON_MODEL_ID,
        errorCode: 'API_KEY_MISSING',
        setupMessage:
          'Gemini 4 Argon (gemini-4-argon) requires a valid GEMINI_API_KEY configured in the AI Studio Settings > Secrets panel. No substitute model was used.',
      });
      return;
    }

    try {
      const {
        prompt,
        productImageBase64,
        productImageMimeType,
      } = req.body as {
        prompt: string;
        productImageBase64?: string;
        productImageMimeType?: string;
      };

      const parts: Array<
        | { text: string }
        | { inlineData: { data: string; mimeType: string } }
      > = [];

      if (productImageBase64 && productImageMimeType) {
        parts.push({
          inlineData: {
            data: productImageBase64,
            mimeType: productImageMimeType,
          },
        });
      }
      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: ARGON_MODEL_ID,
        contents: { parts },
        config: {
          systemInstruction:
            'You are the Executive Creative Director of Forma Atelier. You reason deeply about cultural nuances, luxury and commercial art direction, and truthful advertising. Never invent product benefits, clinical claims, testimonials, or discounts not provided in the brief. Never include overlaid text in the image prompt.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              creativeDirection: {
                type: Type.STRING,
                description:
                  'Concise art direction summary explaining the lighting, staging, and cultural resonance for the selected market.',
              },
              imagePrompt: {
                type: Type.STRING,
                description:
                  'Detailed commercial photography prompt for the image-generation model. Must NOT contain any text, words, or typography.',
              },
              refined: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  alternateHeadline: { type: Type.STRING },
                  shortDescription: { type: Type.STRING },
                  platformCopy: { type: Type.STRING },
                  callToAction: { type: Type.STRING },
                  culturalAdaptationNote: { type: Type.STRING },
                },
                required: [
                  'headline',
                  'alternateHeadline',
                  'shortDescription',
                  'platformCopy',
                  'callToAction',
                  'culturalAdaptationNote',
                ],
              },
              friendly: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  alternateHeadline: { type: Type.STRING },
                  shortDescription: { type: Type.STRING },
                  platformCopy: { type: Type.STRING },
                  callToAction: { type: Type.STRING },
                  culturalAdaptationNote: { type: Type.STRING },
                },
                required: [
                  'headline',
                  'alternateHeadline',
                  'shortDescription',
                  'platformCopy',
                  'callToAction',
                  'culturalAdaptationNote',
                ],
              },
              bold: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  alternateHeadline: { type: Type.STRING },
                  shortDescription: { type: Type.STRING },
                  platformCopy: { type: Type.STRING },
                  callToAction: { type: Type.STRING },
                  culturalAdaptationNote: { type: Type.STRING },
                },
                required: [
                  'headline',
                  'alternateHeadline',
                  'shortDescription',
                  'platformCopy',
                  'callToAction',
                  'culturalAdaptationNote',
                ],
              },
            },
            required: [
              'creativeDirection',
              'imagePrompt',
              'refined',
              'friendly',
              'bold',
            ],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);

      res.json({
        argonAvailable: true,
        modelId: ARGON_MODEL_ID,
        plan: parsed,
      });
    } catch (err) {
      const info = classifyGeminiError(err, ARGON_MODEL_ID);
      res.status(200).json({
        argonAvailable: false,
        modelId: ARGON_MODEL_ID,
        errorCode: info.code,
        setupMessage: info.setupMessage,
        details: info.rawMessage,
      });
    }
  });

  // 2. Advertising Visual Generation via Google AI Studio Image Model (gemini-3.1-flash-lite-image)
  // Guided by the image prompt created by Gemini 4 Argon.
  app.post('/api/campaign/generate-image', async (req, res) => {
    const ai = getAiClient();
    if (!ai) {
      res.status(200).json({
        imageAvailable: false,
        modelId: IMAGE_MODEL_ID,
        errorCode: 'API_KEY_MISSING',
        setupMessage:
          'Image generation requires a billing-enabled API key in Settings > Secrets. Your uploaded product image remains ready for studio editing and backdrop styling.',
      });
      return;
    }

    try {
      const {
        imagePrompt,
        aspectRatio = '1:1',
        preserveProductPhoto = true,
        productImageBase64,
        productImageMimeType,
      } = req.body as {
        imagePrompt: string;
        aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
        preserveProductPhoto?: boolean;
        productImageBase64?: string;
        productImageMimeType?: string;
      };

      const parts: Array<
        | { text: string }
        | { inlineData: { data: string; mimeType: string } }
      > = [];

      if (preserveProductPhoto && productImageBase64 && productImageMimeType) {
        parts.push({
          inlineData: {
            data: productImageBase64,
            mimeType: productImageMimeType,
          },
        });
        parts.push({
          text: `Keep the exact product, packaging, label, and geometry from this photo completely intact and unaltered. Generate a refined studio advertising background and surrounding environment around the product according to this creative direction (do not add any overlaid text or words): ${imagePrompt}`,
        });
      } else {
        parts.push({
          text: `${imagePrompt}. Pure commercial studio photography without any overlaid typography, words, or watermarks.`,
        });
      }

      const response = await ai.models.generateContent({
        model: IMAGE_MODEL_ID,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio,
          },
        },
      });

      let generatedDataUrl: string | null = null;
      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/png';
          generatedDataUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!generatedDataUrl) {
        res.status(200).json({
          imageAvailable: false,
          modelId: IMAGE_MODEL_ID,
          errorCode: 'NO_IMAGE_RETURNED',
          setupMessage:
            'The image model did not return an image frame. You can continue editing with your preserved product photo and studio backdrops.',
        });
        return;
      }

      res.json({
        imageAvailable: true,
        modelId: IMAGE_MODEL_ID,
        imageDataUrl: generatedDataUrl,
      });
    } catch (err) {
      const info = classifyGeminiError(err, IMAGE_MODEL_ID);
      res.status(200).json({
        imageAvailable: false,
        modelId: IMAGE_MODEL_ID,
        errorCode: info.code,
        setupMessage: info.setupMessage,
        details: info.rawMessage,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Forma Atelier server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
