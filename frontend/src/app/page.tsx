'use client'

import { useState } from 'react'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const askQuestion = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    setAnswer('')
    
    try {
      const response = await fetch('http://localhost:3001/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })
      
      const data = await response.json()
      setAnswer(data.answer)
    } catch (error) {
      console.error('Error:', error)
      setAnswer('Sorry, something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 DeepSeek Q&A Test
          </h1>
          <p className="text-gray-600">
            Test project with Vercel + Railway + Supabase
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Question Input */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-4">
              Ask DeepSeek Anything:
            </label>
            <div className="flex gap-4">
              <textarea
                className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Example: Explain quantum computing in simple terms..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
              />
              <button
                onClick={askQuestion}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Thinking...' : 'Ask 🤔'}
              </button>
            </div>
          </div>

          {/* Answer Display */}
          {answer && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold mb-4">📝 Answer:</h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-800">
                  {answer}
                </pre>
              </div>
            </div>
          )}

          {/* Tech Stack Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="font-semibold mb-4">🧪 Tech Stack Test:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="font-bold">Frontend</div>
                <div className="text-sm text-gray-600">Next.js</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="font-bold">Backend</div>
                <div className="text-sm text-gray-600">Node.js</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="font-bold">Database</div>
                <div className="text-sm text-gray-600">Supabase</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="font-bold">AI</div>
                <div className="text-sm text-gray-600">DeepSeek API</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>This is a test project. Next steps: Save answers to database, deploy to Vercel & Railway!</p>
        </div>
      </div>
    </div>
  )
}