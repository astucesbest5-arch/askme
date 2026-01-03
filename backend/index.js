// backend/index.js - CORRECT BACKEND CODE
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting DeepSeek API Server...\n');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('✅ Supabase connected successfully!');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'DeepSeek API Server v2.0',
    status: 'running',
    database: 'connected',
    endpoints: [
      'GET /',
      'POST /api/ask',
      'GET /api/history',
      'GET /health'
    ]
  });
});

// Ask DeepSeek a question
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    console.log(`🤔 Question: "${question.substring(0, 50)}${question.length > 50 ? '...' : ''}"`);

    // 1. Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: question }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    console.log(`✅ DeepSeek answered (${tokensUsed} tokens)`);

    // 2. Save to Supabase
    const { data: dbData, error: dbError } = await supabase
      .from('questions')
      .insert([
        {
          question: question.trim(),
          answer: answer,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('⚠️ Database save warning:', dbError.message);
      // Continue even if save fails
    }

    // 3. Return response
    res.json({
      success: true,
      answer: answer,
      tokens_used: tokensUsed,
      saved_to_db: !dbError,
      question_id: dbData?.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get question history
app.get('/api/history', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('id, question, answer, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data,
      count: data.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check with database connection test
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const { count, error } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    res.json({
      status: 'healthy',
      database: error ? 'disconnected' : 'connected',
      questions_count: count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      status: 'degraded',
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║            🎉 SERVER IS RUNNING!             ║
  ╠═══════════════════════════════════════════════╣
  ║  🔗 Local:    http://localhost:${PORT}        ║
  ║  📝 Ask:      POST /api/ask                  ║
  ║  📊 History:  GET /api/history               ║
  ║  🩺 Health:   GET /health                    ║
  ║  🗄️  Database: ✅ Supabase Connected          ║
  ╚═══════════════════════════════════════════════╝
  `);
  
  console.log('\n🚀 Quick Start:');
  console.log('1. Frontend: http://localhost:3000');
  console.log('2. Backend API: http://localhost:' + PORT);
  console.log('3. Health check: http://localhost:' + PORT + '/health');
});