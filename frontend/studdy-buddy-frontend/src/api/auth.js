import api from "./index"

export const authApi = {
  signup: (username, password) => api.post("/auth/signup", { username, password }),
  login:  (username, password) => api.post("/auth/login",  { username, password }),
}