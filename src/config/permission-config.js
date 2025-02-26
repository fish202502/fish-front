import { data, redirect, useNavigate, useParams } from "react-router-dom";

export const permissionCheckLoader = async ({ params }) => {

  const { roomCode, url } = params;

  if (!roomCode || !url || roomCode ==='undefined') return redirect("/error");

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

return { 
  permission: data.type,
  roomCode : data.roomCode,
  readUrl : data.readUrl,
  writeUrl : data.writeUrl
};
} catch (error) {
    return redirect("/error")
  }
};



