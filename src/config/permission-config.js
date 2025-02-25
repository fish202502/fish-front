import { redirect, useParams } from "react-router-dom";

export const permissionCheckLoader = async ({ params }) => {
  const { roomCode, url } = params;

  try {
    const response = await fetch(
      `http://localhost:8999/api/fish/rooms/${roomCode}/${url}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("API 요청 실패");
    }

    const data = await response.json();
    console.log("✅ permissionCheckLoader result:", data.type);

    return { permission: data.type };
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    return { permission: false };
  }
};

