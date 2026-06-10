import api from './index'

export const chatApi = {
  sendMessage: (document_id, question) => api.post('/chat/', { document_id, question }),
}