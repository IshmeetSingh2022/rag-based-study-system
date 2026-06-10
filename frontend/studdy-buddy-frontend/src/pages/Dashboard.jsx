import { useState, useEffect } from 'react'
import { documentsApi } from '../api/documents'
import UploadModal from '../components/UploadModal'

export default function Dashboard() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showUpload, setShowUpload] = useState(false)

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

  return (
    <div>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl cursor-pointer transition-all"
        >
          + Upload PDF
        </button>
      </div>

      
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={doc => setDocuments(d => [doc, ...d])}
        />
      )}

      {loading && <p className="text-gray-500 text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && documents.length === 0 && (
        <p className="text-gray-500 text-sm">No Document Present</p>
      )}

      <div className="grid grid-cols-1 gap-4">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="font-medium text-gray-800">{doc.filename}</p>
            <p className="text-sm text-gray-500">{doc.subject}</p>
          </div>
        ))}
      </div>
    </div>
  )
}