import api from './index'

export const documentsApi = {
  getAll:  ()         => api.get("/documents/"),
  upload:  (formData) => api.post("/documents/upload", formData),
  delete:  (id)       => api.delete(`/documents/${id}`),
}