import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5000/api", // backend URL
  withCredentials: true, // if using cookies
});


export default api;
