import React, { useEffect, useState } from "react";
import styles from "./Setting.module.scss";
import { usePermission } from "../../pages/MainLayout";
import { useParams } from "react-router-dom";

const Setting = () => {
  const [permission, setPermission] = useState(null);
  const permissionData = usePermission();

  const [showDelModal, setShowDelModal] = useState(false);
  const [showModiModal, setShowModiModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [strongMessage, setStrongMessage] = useState("");

  const { roomCode, url } = useParams();

  useEffect(() => {
    console.log("권한 데이터", permissionData);

    setPermission(permissionData.permission);
  }, []);
  let currentRoom = "";

  if (!permission) {
    currentRoom = "읽기";
  } else {
    currentRoom = "쓰기";
  }

  // 모달 핸들러
  const handleConfirm = () => {
    let modalState;
    if (showDelModal) {
      modalState = "del";
      deleteRoom();
    } else if (showModiModal) {
      modalState = "modi";
      updateRoomData();
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setMessage("정말 삭제하시겠습니까?");
    setStrongMessage("삭제된 방은 복구되지 않습니다.");
    sessionStorage.removeItem("chatName");
    sessionStorage.removeItem("mySessionIds");
    setShowModal(true);
    setShowDelModal(true);
  };
  const handleModi = () => {
    setMessage("방정보를 변경하시겠습니까?");
    setStrongMessage("변경 후 url을 다시 공유해주세요.");
    setShowModal(true);
    setShowModiModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDelModal(false);
    setShowModiModal(false);
  };

  const updateRoomData = async () => {
    if (!roomCode || !url || roomCode === "undefined")
      return redirect("/error");

    try {
      const response = await fetch(
        `http://localhost:8999/api/fish/rooms/${roomCode}/${url}?type=all`,
        {
          method: "PUT",
        }
      );
      const data = await response.json();
      window.location.href = `http://localhost:5173/room/setting/${data.roomCode}/${data.writeUrl}`;

      if (!response.ok) {
        throw new Error("서버 요청 실패");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  const deleteRoom = async () => {
    if (!roomCode || !url || roomCode === "undefined")
      return redirect("/error");

    try {
      const response = await fetch(
        `http://localhost:8999/api/fish/rooms/${roomCode}/${url}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      window.location.href = `http://localhost:5173`;

      if (!response.ok) {
        throw new Error("서버 요청 실패");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <>
      <div className={styles.settingFullFrame}>
      <div className={styles.mainFrame}>
        <div className={styles.currentRoomContainer}>
          <p className={styles.currentRoom}> 현재 방 권한 : {currentRoom} 권한</p>
        {permission && (
          <div className={styles.deleteContainer}>
            <button onClick={handleModi} className={styles.deleteBtn}>
              현재 방 url변경
            </button>
            <button onClick={handleDelete} className={styles.deleteBtn}>
              현재 방 삭제하기
            </button>
          </div>
        )}
        </div>
      </div>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>{message}</p>
            <p className={styles.warningText}>{strongMessage}</p>
            <div className={styles.modalButtons}>
              <button className={styles.confirmBtn} onClick={handleConfirm}>
                확인
              </button>
              <button className={styles.cancelBtn} onClick={handleCloseModal}>
                취소
              </button>
            </div>
          </div>
        </div>
        
      )}
      </div>
    </>
  );
};

export default Setting;
