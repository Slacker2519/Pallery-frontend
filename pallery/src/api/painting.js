import axios from "axios";
import { DB_URL } from "../constants/index.js";

const api = axios.create({
  baseURL: DB_URL,
});

export const getAllPaintings = async () => {
  const res = await api.get("/paintings");
  return res.data;
};

export const getPainting = async (id) => {
  const res = await api.get(`/paintings/${id}`);
  return res.data;
};

export const createPainting = async (data) => {
  const res = await api.post("/paintings", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updatePainting = async (id, data) => {
  const res = await api.patch(`/paintings/${id}`, data);
  return res.data;
};

export const deletePainting = async (id, data) => {
  const res = await api.delete(`/paintings/${id}`, data);
  return res.data;
};
