import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

api.interceptors.request.use(requestConfig => {
  const user = JSON.parse(localStorage.getItem('sb_user'))
  const token = user?.access_token
  if (token) requestConfig.headers.Authorization = `Bearer ${token}`
  
  // FormData ke liye Content-Type mat lagao
  if (!(requestConfig.data instanceof FormData)) {
    requestConfig.headers['Content-Type'] = 'application/json'
  }
  
  return requestConfig
})

api.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sb_user')
      window.location.href = '/'
    }
    const msg = err.response?.data?.detail || err.message || 'Request failed'
    return Promise.reject(new Error(msg))
  }
)

export default api