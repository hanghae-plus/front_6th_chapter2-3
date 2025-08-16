import axios from "axios"

const API_BASE_URL = process.env.NODE_ENV === "development" ? "/api" : "https://dummyjson.com"

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
})
