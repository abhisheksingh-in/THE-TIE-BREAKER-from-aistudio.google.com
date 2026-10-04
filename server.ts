import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client with mandatory User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    identifiedDilemma: {
      type: Type.STRING,
      description: 'A crystal clear 1-2 sentence framing of the core dilemma being solved.',
    },
    options: {
      type: Type.ARRAY,
      description: 'The 2 to 3 distinct options/paths being evaluated.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Short unique identifier like opt_1, opt_2, opt_3' },
          title: { type: Type.STRING, description: 'Descriptive title of the option' },
          tagline: { type: Type.STRING, description: 'Punchy 5-8 word summary of the path' },
          coreThesis: { type: Type.STRING, description: 'Why someone chooses this path and the fundamental bet it represents' },
        },
        required: ['id', 'title', 'tagline', 'coreThesis'],
      },
    },
    prosCons: {
      type: Type.ARRAY,
      description: 'Comprehensive Pros and Cons analysis broken down per option.',
      items: {
        type: Type.OBJECT,
        properties: {
          optionId: { type: Type.STRING },
          optionTitle: { type: Type.STRING },
          pros: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING, description: 'Concise pro statement' },
                detail: { type: Type.STRING, description: 'Concrete reasoning and real-world impact' },
                significance: { type: Type.STRING, description: "Must be 'Critical', 'Major', or 'Moderate'" },
              },
              required: ['point', 'detail', 'significance'],
            },
          },
          cons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING, description: 'Concise con statement' },
                detail: { type: Type.STRING, description: 'Concrete vulnerability, cost, or drawback' },
                significance: { type: Type.STRING, description: "Must be 'Critical', 'Major', or 'Moderate'" },
              },
              required: ['point', 'detail', 'significance'],
            },
          },
          netAdvantageScore: {
            type: Type.NUMBER,
            description: 'Rational score from -5 (net negative) to +5 (net positive)',
          },
        },
        required: ['optionId', 'optionTitle', 'pros', 'cons', 'netAdvantageScore'],
      },
    },
    comparisonMatrix: {
      type: Type.OBJECT,
      description: 'A structured head-to-head comparison table across key decision dimensions.',
      properties: {
        dimensions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dimension: { type: Type.STRING, description: 'Criterion name, e.g. Financial Upside, Downside Risk, Work-Life Balance, Career Trajectory, Reversibility, Execution Friction' },
              category: { type: Type.STRING, description: "One of: 'Financial', 'Strategic', 'Personal', 'Operational', 'Risk'" },
              weight: { type: Type.STRING, description: "One of: 'High', 'Medium', 'Low'" },
              scores: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    optionId: { type: Type.STRING },
                    scoreText: { type: Type.STRING, description: "Short qualitative score e.g. '8/10', 'High', 'Low Risk', '$$$'" },
                    scoreNumeric: { type: Type.NUMBER, description: 'Numeric score from 1 (unfavorable) to 10 (favorable)' },
                    assessment: { type: Type.STRING, description: '1-2 sentence specific assessment for this dimension' },
                  },
                  required: ['optionId', 'scoreText', 'scoreNumeric', 'assessment'],
                },
              },
              winnerOptionId: { type: Type.STRING, description: "The winning optionId for this dimension, or 'tie'" },
              nuance: { type: Type.STRING, description: 'Key subtle trade-off to consider on this specific dimension' },
            },
            required: ['dimension', 'category', 'weight', 'scores', 'winnerOptionId', 'nuance'],
          },
        },
        overallComparisonSummary: { type: Type.STRING, description: 'Executive summary of what the matrix reveals' },
      },
      required: ['dimensions', 'overallComparisonSummary'],
    },
    swotAnalysis: {
      type: Type.ARRAY,
      description: 'Full SWOT breakdown (Strengths, Weaknesses, Opportunities, Threats) for each option.',
      items: {
        type: Type.OBJECT,
        properties: {
          optionId: { type: Type.STRING },
          optionTitle: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Internal advantages and inherent upsides' },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Internal flaws, constraints, or disadvantages' },
          opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'External tailwinds, unlockable upsides, future advantages' },
          threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'External risks, tail risks, macroeconomic or competitive threats' },
        },
        required: ['optionId', 'optionTitle', 'strengths', 'weaknesses', 'opportunities', 'threats'],
      },
    },
    verdict: {
      type: Type.OBJECT,
      description: 'The conclusive Tie Breaker synthesis and verdict.',
      properties: {
        recommendedOptionId: { type: Type.STRING, description: 'The option ID that is recommended as the default tie-breaker winner' },
        recommendationHeadline: { type: Type.STRING, description: 'Sharp, memorable headline stating the verdict' },
        executiveSummary: { type: Type.STRING, description: 'Crisp 3-4 sentence strategic synthesis explaining why this path wins' },
        theCrucialPivot: { type: Type.STRING, description: 'The single question or pivot factor that turns the decision' },
        reversibilityCheck: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "Must be 'Two-Way Door', 'One-Way Door', or 'Hybrid'" },
            explanation: { type: Type.STRING, description: 'Assessment of how reversible or irreversible this decision is' },
          },
          required: ['type', 'explanation'],
        },
        fortyEightHourLitmusTest: { type: Type.STRING, description: 'A concrete short experiment or action to run in the next 48 hours to confirm conviction' },
        ifTornFiftyFiftyRule: { type: Type.STRING, description: 'The definitive tie-breaking rule if the decision-maker feels exactly 50/50' },
      },
      required: [
        'recommendedOptionId',
        'recommendationHeadline',
        'executiveSummary',
        'theCrucialPivot',
        'reversibilityCheck',
        'fortyEightHourLitmusTest',
        'ifTornFiftyFiftyRule',
      ],
    },
  },
  required: ['identifiedDilemma', 'options', 'prosCons', 'comparisonMatrix', 'swotAnalysis', 'verdict'],
};

// API Endpoint to analyze a dilemma
app.post('/api/analyze-dilemma', async (req, res) => {
  try {
    const { dilemma, additionalContext, priorityLens } = req.body;

    if (!dilemma || typeof dilemma !== 'string' || dilemma.trim().length < 5) {
      return res.status(400).json({ error: 'Please provide a descriptive decision dilemma to analyze.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is not configured on the server.',
      });
    }

    const prompt = `
You are 'The Tie Breaker', an elite rational decision strategist and analytical advisor.
Analyze the following decision dilemma with ruthless objectivity, structured rigor, and actionable clarity.

DILEMMA:
"${dilemma.trim()}"

${additionalContext ? `ADDITIONAL CONTEXT / CONSTRAINTS:\n"${additionalContext.trim()}"` : ''}
${priorityLens ? `PRIORITY LENS TO EMPHASIZE:\n"${priorityLens.trim()}"` : ''}

CRITICAL INSTRUCTIONS:
1. Deconstruct the dilemma into 2 to 3 clearly defined mutually exclusive or distinct paths (e.g. Option A vs Option B, or Option A vs B vs Status Quo).
2. Generate an in-depth PROS & CONS list for each option. For each pro and con, explain the specific mechanism of impact and rate its significance as 'Critical', 'Major', or 'Moderate'. Provide at least 4-5 pros and 3-5 cons per option.
3. Construct a head-to-head COMPARISON TABLE covering at least 5-7 vital dimensions (e.g., Financial Upside/ROI, Downside Risk & Worst Case, Effort/Friction to Implement, Work-Life Balance & Wellbeing, Long-Term Optionality & Career/Growth Trajectory, Reversibility, Speed to Value). For each dimension, rate each option (numeric 1-10 and descriptive label), identify the winner, and note the crucial nuance.
4. Provide a full SWOT ANALYSIS (Strengths, Weaknesses, Opportunities, Threats) for each option with at least 3-4 bullet points per quadrant.
5. Deliver a definitive TIE BREAKER VERDICT:
   - Identify the winning option if all factors are weighted objectively.
   - Formulate 'The Crucial Pivot': the single litmus question where the answer dictates the choice (e.g., "If your primary goal over the next 18 months is capital accumulation over pedigree, choose Option A; otherwise choose Option B").
   - Assess reversibility: Is this a Jeff Bezos 'Two-Way Door' (easily reversed if wrong) or a 'One-Way Door' (irreversible, high consequence)?
   - Formulate a 48-Hour Litmus Test: a concrete low-cost micro-action or conversation to take immediately to test reality.
   - Formulate the 'If You're Still 50/50' golden rule for this specific scenario.
`;

    // Attempt generation with retry and fallback across supported flash models
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let responseText: string | undefined;

    for (const modelName of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: `You are 'The Tie Breaker', a master of game theory, behavioral economics, risk mitigation, and executive decision-making. You cut through analysis paralysis, emotional noise, and sunk-cost fallacies to deliver clarity, structured comparisons, and decisive resolution.`,
              temperature: 0.3,
              responseMimeType: 'application/json',
              responseSchema: analysisSchema,
            },
          });

          if (response.text) {
            responseText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${modelName} attempt ${attempt} failed:`, err?.message || err);
          // Wait briefly before retry if 503/429
          await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
        }
      }
      if (responseText) break;
    }

    if (!responseText) {
      throw lastError || new Error('Gemini models are temporarily busy. Please retry in a moment.');
    }

    const parsedData = JSON.parse(responseText);

    // Attach metadata
    const completeAnalysis = {
      id: 'dilemma_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      dilemmaQuery: dilemma.trim(),
      contextNotes: additionalContext?.trim() || undefined,
      ...parsedData,
    };

    res.json(completeAnalysis);
  } catch (error: any) {
    console.error('Error analyzing dilemma:', error);
    res.status(500).json({
      error: error?.message || 'An error occurred while running the decision analysis.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Serve frontend: Vite middleware in dev, static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`The Tie Breaker server running on http://0.0.0.0:${PORT}`);
});
