import React, { useState } from "react";
import ShowUrl from "./ShowUrl";
import "./CreateRoom.css"; // CSS 연결

const CreateRoom = () => {
  const [createFlag, setCreateFlag] = useState(false);
  const [data, setData] = useState(null); // API 데이터 상태

  const handleCreateBtn = async () => {
    try {
      const response = await fetch("http://localhost:8999/api/fish/rooms",{
        method:'POST',
      });
      const result = await response.json();
      console.log(result); // API 응답 확인

      setData(result); // 데이터 저장
      setCreateFlag(true); // 데이터가 들어온 후 상태 변경
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      {!createFlag ? (
        <div className="title" onClick={handleCreateBtn}>
          + 방 만들기
        </div>
      ) : (
        data && <ShowUrl handlecreateBtn={handleCreateBtn} data={data} />
      )}
    </div>
  );
};

export default CreateRoom;