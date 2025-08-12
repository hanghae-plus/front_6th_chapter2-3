// src/shared/api/client.ts
import axios from "axios"

export const axiosClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})
