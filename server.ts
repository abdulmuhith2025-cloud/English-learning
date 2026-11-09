import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, type FunctionDeclaration } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Helper to get GoogleGenAI client with telemetry header
function getGenAIClient(customApiKey?: string): GoogleGenAI {
  const apiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Model auto-discovery endpoint
app.get('/api/gemini/models', async (req: Request, res: Response) => {
  try {
    const customKey = req.headers['x-gemini-api-key'] as string | undefined;
    const ai = getGenAIClient(customKey);
    const modelsList = await ai.models.list();
    
    // Auto-discovery logic: keep models that support generateContent and match gemini-<version>-flash
    const flashModels: string[] = [];
    for await (const m of modelsList) {
      const name = m.name?.replace(/^models\//, '') || '';
      const methods = (m as any).supportedActions || (m as any).supportedGenerationMethods || [];
      const supportsGen = methods.length === 0 || methods.some((action: string) => action.toLowerCase().includes('generatecontent'));
      
      // Matches gemini-<version>-flash exactly or variants like gemini-*-flash
      if (supportsGen && /^gemini-.*-flash($|-.*)/i.test(name)) {
        flashModels.push(name);
      }
    }

    // Sort to pick highest version, prioritizing pure text flash models over specialized tts/image models
    const isPureChatFlash = (name: string) => !/(-tts|-image|-live|-native-audio|-clip)/i.test(name);
    
    flashModels.sort((a, b) => {
      const aPure = isPureChatFlash(a);
      const bPure = isPureChatFlash(b);
      if (aPure && !bPure) return -1;
      if (!aPure && bPure) return 1;

      const aVerMatch = a.match(/gemini-(\d+(?:\.\d+)?)/);
      const bVerMatch = b.match(/gemini-(\d+(?:\.\d+)?)/);
      const aVer = aVerMatch ? parseFloat(aVerMatch[1]) : 0;
      const bVer = bVerMatch ? parseFloat(bVerMatch[1]) : 0;
      if (bVer !== aVer) return bVer - aVer;
      return b.localeCompare(a);
    });

    res.json({
      success: true,
      models: flashModels,
      recommended: flashModels[0] || 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error listing models:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to list models',
      status: error?.status || 500,
    });
  }
});

// Function declarations for Laura Assistant tools
const lauraTools: FunctionDeclaration[] = [
  {
    name: 'add_item',
    description: 'Catat agenda, tugas kuliah/disertasi, jadwal mengajar, tenggat beasiswa, atau rencana produk baru.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: 'Kategori item: "hari_ini", "mengajar", "disertasi", "referensi", "edit_video", "upload", "beasiswa", "produk_digital", "rutinitas", "rute"',
        },
        title: {
          type: Type.STRING,
          description: 'Judul kegiatan, topik mengajar, nama beasiswa, atau judul item',
        },
        date: {
          type: Type.STRING,
          description: 'Format tanggal YYYY-MM-DD. Hitung tanggal relatif terhadap waktu saat ini.',
        },
        time: {
          type: Type.STRING,
          description: 'Format waktu 24 jam HH:MM (contoh: "08:30", "14:00")',
        },
        note: {
          type: Type.STRING,
          description: 'Catatan tambahan seperti ruangan, link, deskripsi tugas, atau detail lainnya',
        },
      },
      required: ['category', 'title'],
    },
  },
  {
    name: 'complete_item',
    description: 'Menandai kegiatan atau tugas tertentu telah selesai.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: 'Kategori item',
        },
        title: {
          type: Type.STRING,
          description: 'Kata kunci atau judul item yang diselesaikan',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'delete_item',
    description: 'Menghapus suatu agenda atau item dari daftar.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: 'Kategori item',
        },
        title: {
          type: Type.STRING,
          description: 'Kata kunci atau judul item yang dihapus',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'list_items',
    description: 'Melihat atau menanyakan agenda dan tenggat yang tersimpan.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: 'Kategori yang ingin dilihat (atau "all" untuk semua)',
        },
      },
    },
  },
];

// Chat endpoint (supports streaming and function calling)
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const customKey = req.headers['x-gemini-api-key'] as string | undefined;
  const {
    contents,
    systemInstruction,
    model: requestedModel,
    enableTools = true,
    stream = false,
  } = req.body;

  let modelName = (requestedModel || 'gemini-3.8-flash')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^models\//, '');

  const ai = getGenAIClient(customKey);

  const config: any = {
    systemInstruction,
    temperature: 0.7,
  };

  if (enableTools) {
    config.tools = [{ functionDeclarations: lauraTools }];
  }

  try {
    if (stream) {
      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents,
          config,
        });

        for await (const chunk of responseStream) {
          const text = chunk.text || '';
          const calls = chunk.functionCalls;
          res.write(`data: ${JSON.stringify({ text, functionCalls: calls })}\n\n`);
        }
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (streamErr: any) {
        // If NOT_FOUND error, retry once with fallback
        if (streamErr?.status === 404 || streamErr?.message?.includes('not found') || streamErr?.message?.includes('NOT_FOUND')) {
          console.warn(`Model ${modelName} not found, attempting auto-discovery retry...`);
          try {
            const list = await ai.models.list();
            const flashModels: string[] = [];
            for await (const m of list) {
              const name = m.name?.replace(/^models\//, '') || '';
              if (/^gemini-.*-flash/i.test(name)) flashModels.push(name);
            }
            const fallbackModel = flashModels[0] || 'gemini-3.8-flash';
            const retryStream = await ai.models.generateContentStream({
              model: fallbackModel,
              contents,
              config,
            });
            for await (const chunk of retryStream) {
              const text = chunk.text || '';
              const calls = chunk.functionCalls;
              res.write(`data: ${JSON.stringify({ text, functionCalls: calls, modelFallback: fallbackModel })}\n\n`);
            }
            res.write('data: [DONE]\n\n');
            res.end();
            return;
          } catch (retryErr: any) {
            res.write(`data: ${JSON.stringify({ error: retryErr?.message || 'Fallback failed', status: retryErr?.status || 500 })}\n\n`);
            res.end();
            return;
          }
        }
        res.write(`data: ${JSON.stringify({ error: streamErr?.message || 'Stream error', status: streamErr?.status || 500 })}\n\n`);
        res.end();
      }
    } else {
      // Unary call
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config,
        });

        res.json({
          success: true,
          text: response.text || '',
          functionCalls: response.functionCalls || null,
        });
      } catch (callErr: any) {
        if (callErr?.status === 404 || callErr?.message?.includes('not found') || callErr?.message?.includes('NOT_FOUND')) {
          console.warn(`Model ${modelName} not found, attempting unary fallback...`);
          const list = await ai.models.list();
          const flashModels: string[] = [];
          for await (const m of list) {
            const name = m.name?.replace(/^models\//, '') || '';
            if (/^gemini-.*-flash/i.test(name)) flashModels.push(name);
          }
          const fallbackModel = flashModels[0] || 'gemini-3.8-flash';
          const retryRes = await ai.models.generateContent({
            model: fallbackModel,
            contents,
            config,
          });
          res.json({
            success: true,
            text: retryRes.text || '',
            functionCalls: retryRes.functionCalls || null,
            modelFallback: fallbackModel,
          });
          return;
        }
        throw callErr;
      }
    }
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    let errorMsg = error?.message || 'Chat generation failed';
    let statusCode = error?.status || 500;
    try {
      const parsed = typeof errorMsg === 'string' ? JSON.parse(errorMsg) : errorMsg;
      if (parsed?.error?.message) {
        errorMsg = `${parsed.error.status || 'API Error'}: ${parsed.error.message}`;
        if (parsed.error.code) statusCode = parsed.error.code;
      }
    } catch (_) {}

    res.status(statusCode >= 100 && statusCode < 600 ? statusCode : 500).json({
      success: false,
      error: errorMsg,
      status: statusCode,
    });
  }
});

// Gemini TTS endpoint
app.post('/api/gemini/tts', async (req: Request, res: Response) => {
  try {
    const customKey = req.headers['x-gemini-api-key'] as string | undefined;
    const { text, voiceName = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const ai = getGenAIClient(customKey);
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from Gemini TTS' });
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS endpoint error:', error);
    res.status(error?.status || 500).json({
      success: false,
      error: error?.message || 'TTS generation failed',
      status: error?.status || 500,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Laura-Personal Assistance',
    hasEnvKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

async function main() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Laura-Personal Assistance server running on http://0.0.0.0:${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
