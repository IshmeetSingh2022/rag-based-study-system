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

  return (
    <div className="flex gap-6 h-[calc(100vh-4rem)]">

      {/* Left — Documents */}
      <div className="w-64 flex-shrink-0">
        <h2 className="text-sm font-semibold text-gray-600 mb-3">Documents</h2>
        <div className="flex flex-col gap-2">
          {documents.map(doc => (
            <button
              key={doc.id}
              onClick={() => selectDoc(doc)}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer
                ${selectedDoc?.id === doc.id
                  ? 'border-purple-400 bg-purple-50 text-purple-700 font-medium'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-purple-200'
                }`}
            >
              <p className="font-medium truncate">{doc.filename}</p>
              <p className="text-xs text-gray-400 mt-0.5">{doc.subject}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right — Chat */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-800">
            {selectedDoc ? selectedDoc.filename : 'Document choose karo'}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {!selectedDoc && (
            <p className="text-gray-400 text-sm text-center mt-8">
              Left side se document select karo
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
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

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="px-6 py-4 border-t border-gray-200 flex gap-3 items-end"
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
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  )
}