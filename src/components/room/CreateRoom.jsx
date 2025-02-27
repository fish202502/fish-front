import React, { useEffect, useState } from "react";
import ShowUrl from "./ShowUrl";
import "./CreateRoom.css"; // CSS 연결
import { useLocation } from "react-router-dom";

const CreateRoom = () => {
  const [createFlag, setCreateFlag] = useState(false);
  const [data, setData] = useState(null); // API 데이터 상태

  const location = useLocation();
  const { roomCode, url } = location.state || {};

  // useEffect(() => {
  //   const updateRoomData = async () => {
  //     if (!roomCode || !url || roomCode ==='undefined') return redirect("/error");

  //     try {
  //       const response = await fetch(
  //         `http://localhost:8999/api/fish/rooms/${roomCode}/${url}?type=all`,
  //         {
  //           method: "PUT",
  //         }
  //       );
  //       const data = await response.json();
  //       setData(data);
  //       setCreateFlag(true);

  //       if (!response.ok) {
  //         throw new Error("서버 요청 실패");
  //       }
  //     } catch (error) {
  //       console.error("에러 발생:", error);
  //     }
  //   };

  //   updateRoomData();
  // }, []);

  const handleCreateBtn = async () => {
    try {
      const response = await fetch("http://localhost:8999/api/fish/rooms", {
        method: "POST",
      });

      const result = await response.json();
      console.log(result); // API 응답 확인

      setData(result); // 데이터 저장
      setCreateFlag(true); // 데이터가 들어온 후 상태 변경
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toCreateRoom = () => {
    setCreateFlag(false);
  };

  return (
    <div className="container">
      {!createFlag ? (
        <div className="title" onClick={handleCreateBtn}>
          + 방 만들기
        </div>
      ) : (
        data && (
          <ShowUrl after={true} onBack={toCreateRoom} data={data} />
        )
      )}
    </div>
  );
};

export default CreateRoom;
