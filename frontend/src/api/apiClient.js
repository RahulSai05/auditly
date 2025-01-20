import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000", // Base URL of your FastAPI backend
});

export default apiClient;
