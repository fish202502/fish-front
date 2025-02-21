import React, { useState } from "react";
import ShowUrl from "./ShowUrl";
import "./CreateRoom.css";  // ✅ CSS 연결

const CreateRoom = () => {
  const [createFlag, setCreateFlag] = useState(false);

  const data = {
    roomCode: "dd2ae214",
    readUrl: "1739254311630bb2bf",
    writeUrl: "173925431160f0d00e",
  };

  const handleCreateBtn = () => {
    setCreateFlag(!createFlag);
  };

  return (
    <div className="container">
      {!createFlag ? (
        <div className="title" onClick={handleCreateBtn}>
          + 방 만들기
        </div>
      ) : (
        <ShowUrl handlecreateBtn={handleCreateBtn} data={data} />
      )}
    </div>
  );
};

export default CreateRoom;
