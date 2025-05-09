import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
  const { question } = req.body;

  try {
    const prompt = `Na podstawie poniższego pytania i podanych opcji wybierz najbardziej trafną odpowiedź.
Odpowiedz tylko literą spośród: A, B, C lub D.
Treść pytania i odpowiedzi:\n\n${question}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Błąd w zapytaniu do OpenAI' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Serwer działa na porcie 3000`);
});
