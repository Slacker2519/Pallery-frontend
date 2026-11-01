import api from "./api";

export const getAllAlbums = async () => {
  const res = await api.get("/albums");
  return res.data;
};

export const getAlbum = async (id) => {
  const res = await api.get(`/albums/${id}`);
  return res.data;
};

export const createAlbum = async (data) => {
  const res = await api.post("/albums", data);
  return res.data;
};

export const updateAlbum = async (id, data) => {
  const res = await api.patch(`/albums/${id}`, data);
  return res.data;
};

export const deleteAlbum = async (id) => {
  const res = await api.delete(`/albums/${id}`);
  return res.data;
};
