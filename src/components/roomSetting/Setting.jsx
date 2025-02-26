import React, { useEffect, useState } from "react";
import styles from "./Setting.module.scss";
import { usePermission } from "../../pages/MainLayout";

const Setting = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permission, setPermission] = useState(null);
  const permissionData = usePermission();

  useEffect(() => {
    console.log("권한 데이터" , permissionData );
    
    setPermission(permissionData.permission);

  }, []);
  let currentRoom ="";

  if(!permission){
    currentRoom ="읽기"
  }else{
    currentRoom = "쓰기"
  }


  const handleDelete = () => {
    alert("방이 삭제되었습니다.");
    setIsModalOpen(false);
    // 여기에서 실제 삭제 로직 추가 (예: API 호출)
  };
  

  return (
    <div className={styles.mainFrame}>
      <h2>방 설정</h2>
      <div className={styles.currentRoomContainer}>
        <p className={styles.currentRoom}>방 권한 : {currentRoom} 권한</p>
       
      </div>
      <div className={styles.deleteContainer}>
        <p className={styles.deleteContent}>방 삭제</p>
        <button onClick={() => setIsModalOpen(true)} className={styles.deleteBtn}>
          삭제하기
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>정말 삭제하시겠습니까?</p>
            <div className={styles.buttonGroup}>
              <button onClick={handleDelete} className={styles.confirmBtn}>
                확인
              </button>
              <button onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
