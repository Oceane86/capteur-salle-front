// src/components/RoomRedirect.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { mockRooms } from "@/data/mockData";

export default function RoomRedirect() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomId as string | undefined;

  useEffect(() => {
    if (!roomId) {
      router.push("/login");
      return;
    }

    const room = mockRooms.find((r) => r.id === roomId);
    if (!room) {
      router.push("/login");
      return;
    }

    const role = localStorage.getItem("role");

    if (!role) {
      router.push("/login");
      return;
    }

    if (role === "admin") router.push(`/admin/modules/${room.moduleId}`);
    if (role === "student") router.push(`/student/room/${roomId}`);
  }, [roomId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0092bd] mx-auto"></div>
        <p className="mt-4 text-[#5F6368]">Redirection en cours...</p>
      </div>
    </div>
  );
}
