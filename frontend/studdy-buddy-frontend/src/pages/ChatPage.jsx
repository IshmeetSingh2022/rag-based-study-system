import { useState, useEffect, useRef } from 'react'
import { documentsApi } from '../api/documents'
import { chatApi } from '../api/chat'

export default function ChatPage() {
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchDocuments() {
    try {
      const data = await documentsApi.getAll()
      setDocuments(data)
    } catch (err) {
      console.log(err.message)
    }
  }

  function selectDoc(doc) {
    setSelectedDoc(doc)
    setMessages([{
      role: 'assistant',
      content: `"${doc.filename}" load ho gaya! Kuch bhi poochho.`
    }])
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || !selectedDoc || loading) return

    const question = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', content: question }])
    setLoading(true)

    try {
      const data = await chatApi.sendMessage(selectedDoc.id, question)
      setMessages(m => [...m, { role: 'assistant', content: data.answer }])
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', content: `Error: ${err.message}` }])
    }
    setLoading(false)
  }

  const suggestions = [
    'Summarize this document',
    'What are the main topics?',
    'Explain the key concepts',
    'Give me practice questions',
  ]

  return (
    <div className="flex gap-6 h-[calc(100vh-4rem)]">

      
      <div className="w-64 flex-shrink-0 flex flex-col">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Documents
        </p>

        {documents.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-8">
            Koi document nahi hai
          </p>
        )}

        <div className="flex flex-col gap-2 overflow-y-auto">
          {documents.map(doc => (
            <button
              key={doc.id}
              onClick={() => selectDoc(doc)}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer
                ${selectedDoc?.id === doc.id
                  ? 'border-purple-400 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/30'
                }`}
            >
              
              <div className="flex items-center gap-2 mb-1">
                <svg className={`w-3.5 h-3.5 flex-shrink-0 ${selectedDoc?.id === doc.id ? 'text-purple-500' : 'text-red-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p className="font-medium truncate text-xs">{doc.filename}</p>
              </div>

              {/* Subject badge */}
              <div className="flex items-center gap-2 pl-5">
                <span className="text-xs text-gray-400">{doc.subject}</span>
                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">{doc.chunk_count} chunks</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden">

        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          {selectedDoc ? (
            <>
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 truncate">{selectedDoc.filename}</p>
                <p className="text-xs text-gray-400">{selectedDoc.subject} · {selectedDoc.chunk_count} chunks</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p className="text-sm text-gray-400">Left side se document select karo</p>
            </div>
          )}
        </div>

        
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">

         
          {!selectedDoc && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-1">Koi document select nahi kiya</p>
              <p className="text-gray-400 text-sm">Left side se PDF choose karo aur AI se poochho</p>
            </div>
          )}

          
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
            
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
              )}

              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

        
          {selectedDoc && messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-full hover:bg-purple-100 transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          
          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        
        <form
          onSubmit={sendMessage}
          className="px-6 py-4 border-t border-gray-100 flex gap-3 items-end"
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(e)
              }
            }}
            placeholder={selectedDoc ? 'Kuch bhi poochho...' : 'Pehle document choose karo'}
            disabled={!selectedDoc}
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none disabled:bg-gray-50 disabled:text-gray-400 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || !selectedDoc || loading}
            className={`p-2.5 rounded-xl text-white transition-all cursor-pointer
              ${input.trim() && selectedDoc && !loading
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-200 cursor-not-allowed'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>

      </div>
    </div>
  )
}