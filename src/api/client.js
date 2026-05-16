import axios from 'axios'

export default axios.create({
  baseURL: 'https://metrolink-backend-production.up.railway.app'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api