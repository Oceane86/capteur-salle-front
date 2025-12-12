// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// GET : Rooms list
export const fetchRooms = async () => {
  const res = await api.get('/api/rooms');
  return res.data;
};

// GET : Room by ID
export const fetchRoomById = async (roomId: string) => {
  const res = await api.get(`/api/rooms/${roomId}`);
  return res.data;
};

// POST : Create a reservation
export const createReservation = async (
  roomId: string,
  startTime: string,
  endTime: string,
  reasonType: string,
  customReason?: string
) => {
  const res = await api.post(`/api/rooms/${roomId}/reservations`, {
    startTime,
    endTime,
    reasonType,
    customReason,
  });
  return res.data;
};

// GET : Modules list
export const fetchModules = async () => {
  const res = await api.get('/api/modules');
  return res.data;
};

// GET : Module by ID
export const fetchModuleById = async (moduleId: string) => {
  const res = await api.get(`/api/modules/${moduleId}`);
  return res.data;
};

// PATCH : Create or update module
export const createModule = async ({
  hardwareId,
  name,
  roomId,
}: {
  hardwareId: string;
  name: string;
  roomId: string;
}) => {
  const res = await api.patch(`/api/modules/${hardwareId}`, {
    name,
    roomId,
  });
  return res.data;
};

export async function deleteModule(id: string) {
  const res = await fetch(`/api/modules/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Suppression impossible");
  }

  return res.json();
}


export default api;
