import { useState } from 'react'
import { documentsApi } from '../api/documents'

export default function UploadModal({ onClose, onUploaded }) {
  const [file, setFile] = useState(null)
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(e) {
    e.preventDefault()
  if (!file) return

  setLoading(true)
  setError('')

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('subject', subject || 'General')

    console.log('FILE:', file)                    // ← add karo
    console.log('FORMDATA:', formData.get('file')) // ← add karo

    const data = await documentsApi.upload(formData)

     
      onUploaded(data)
      onClose()
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md">

        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Upload Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleUpload}>

          
          <div
            onClick={() => document.getElementById('fileInput').click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer mb-4 transition-all
              ${file
                ? 'border-purple-400 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
              }`}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={e => setFile(e.target.files[0])}
            />
            <p className={`text-sm ${file ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>
              {file ? file.name : 'Click to choose a PDF'}
            </p>
          </div>

          
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1.5">Subject (optional)</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Biology, Math, History"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>

          
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl mb-4">
              {error}
            </p>
          )}

          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || loading}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}