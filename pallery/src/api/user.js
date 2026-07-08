import api from "./api.js";

export const register = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getUser = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const getUserPaintings = async (id) => {
  const res = await api.get(`/users/${id}/paintings`);
  return res.data;
};

export const getUserAlbums = async (id) => {
  const res = await api.get(`/users/${id}/albums`);
  return res.data;
};
