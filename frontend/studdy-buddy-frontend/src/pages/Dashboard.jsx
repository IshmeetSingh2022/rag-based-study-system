import { useState, useEffect } from 'react'
import { documentsApi } from '../api/documents'
import UploadModal from '../components/UploadModal'

export default function Dashboard() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    try {
      const data = await documentsApi.getAll()
      setDocuments(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function deleteDocument(id) {
    setDeletingId(id)
    try {
      await documentsApi.delete(id)
      setDocuments(d => d.filter(doc => doc.id !== id))
    } catch (err) {
      alert(err.message)
    }
    setDeletingId(null)
  }

  const subjectColors = {
    math:      'bg-blue-50 text-blue-600',
    physics:   'bg-orange-50 text-orange-600',
    chemistry: 'bg-green-50 text-green-600',
    biology:   'bg-emerald-50 text-emerald-600',
    history:   'bg-yellow-50 text-yellow-600',
    oops:      'bg-purple-50 text-purple-600',
    gda:       'bg-pink-50 text-pink-600',
  }

  function getSubjectColor(subject) {
    const key = subject?.toLowerCase()
    return subjectColors[key] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
          <p className="text-sm text-gray-400 mt-1">{documents.length} document{documents.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl cursor-pointer transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Upload PDF
        </button>
      </div>

      
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={doc => setDocuments(d => [doc, ...d])}
        />
      )}

      
      {loading && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      
      {!loading && documents.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="11" x2="12" y2="17"/>
              <line x1="9" y1="14" x2="15" y2="14"/>
            </svg>
          </div>
          <h3 className="text-gray-700 font-medium mb-1">NO DOCUMENT</h3>
          <p className="text-gray-400 text-sm mb-6">First Upload Pdf</p>
          <button
            onClick={() => setShowUpload(true)}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl cursor-pointer transition-all"
          >
            + Upload 
          </button>
        </div>
      )}

      
      {!loading && documents.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:border-purple-200 hover:shadow-sm transition-all group"
            >
              
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{doc.filename}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSubjectColor(doc.subject)}`}>
                    {doc.subject}
                  </span>
                  <span className="text-xs text-gray-400">
                    {doc.chunk_count} chunks
                  </span>
                  {doc.chunk_count === 0 && (
                    <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                      Processing...
                    </span>
                  )}
                </div>
              </div>

             
              <button
                onClick={() => deleteDocument(doc.id)}
                disabled={deletingId === doc.id}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-50"
              >
                {deletingId === doc.id ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}