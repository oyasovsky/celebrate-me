require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

admin.initializeApp();

const db = admin.firestore();

// Initialize OpenAI with API key from environment
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-loading',
});

const app = express();
app.use(cors({ origin: true }));

app.post('/start', async (req, res) => {
  const { name, persona, stats, scroll, trials } = req.body;
  const docRef = await db.collection('celebrations').add({
    name,
    persona,
    stats,
    scroll,
    trials,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  res.json({ id: docRef.id, link: `/celebrate/${name}?id=${docRef.id}` });
});

// New endpoint for OpenAI burnout analysis
app.post('/analyze-burnout', async (req, res) => {
  try {
    const prompt = `Generate 3-5 completely random, funny, and creative developer metrics for a birthday celebration app. 

Be creative and unpredictable! Think of absurd, humorous, or oddly specific developer traits. Examples could be:
- "Coffee Dependency Level"
- "Bug Whispering Ability" 
- "Stack Overflow Copy-Paste Mastery"
- "Meeting Survival Instinct"
- "IDE Theme Obsession"
- "Git Commit Message Poetry"
- "Code Review Nitpick Resistance"
- "Deploy on Friday Courage"

Create unique metrics that are:
1. Funny and unexpected
2. Somewhat relatable to developers
3. Measurable (with percentages, scores, or funny units)

Format your response as JSON:
{
  "metrics": [
    {
      "name": "Creative metric name",
      "value": "funny value with units",
      "description": "brief funny description"
    }
  ],
  "explanation": "A fun explanation of why this developer has these specific stats",
  "wisdom": "A humorous developer wisdom quote"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a witty developer personality analyzer. Generate completely random, creative, and humorous developer metrics. Be unpredictable and funny. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.9
    });

    const response = completion.choices[0].message.content;
    
    // Try to parse JSON response, fallback to generated stats if parsing fails
    try {
      const parsedResponse = JSON.parse(response);
      res.json(parsedResponse);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback to generated stats
      res.json({
        metrics: [
          {
            name: "Coffee Dependency Level",
            value: "87%",
            description: "Survives on pure caffeine"
          },
          {
            name: "Bug Whispering Ability", 
            value: "42%",
            description: "Sometimes bugs listen"
          },
          {
            name: "Stack Overflow Copy-Paste Mastery",
            value: "95%",
            description: "Ctrl+C, Ctrl+V expert"
          }
        ],
        explanation: "AI had trouble parsing its own response. Classic developer moment.",
        wisdom: "When the AI fails to parse JSON, it's time for a coffee break."
      });
    }

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate developer stats',
      metrics: [
        {
          name: "Coffee Dependency Level",
          value: "87%",
          description: "Survives on pure caffeine"
        },
        {
          name: "Bug Whispering Ability", 
          value: "42%",
          description: "Sometimes bugs listen"
        },
        {
          name: "Stack Overflow Copy-Paste Mastery",
          value: "95%",
          description: "Ctrl+C, Ctrl+V expert"
        }
      ],
      explanation: "The AI is having a moment. Let's say you're a typical developer with random stats.",
      wisdom: "When in doubt, restart everything."
    });
  }
});

exports.api = functions.https.onRequest(app);
