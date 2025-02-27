import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./Modal.module.css"; // CSS 모듈 임포트
import ChatNameContext from "../../context/chat-context";
import { generateRandomNickname } from "../../utils/chatNameManager";

function Modal({ onNameSubmit }) {
  const [userName, setUserName] = useState("");
  const inputRef = useRef(null); // input에 대한 참조를 생성

  const { chatName, setChatName } = useContext(ChatNameContext);

  useEffect(() => {
    if (chatName) {
      setUserName(chatName);
      inputRef.current.value = chatName;
    } else {
      const random = generateRandomNickname();
      inputRef.current.value = random;
      setUserName(random);
    }
    // 컴포넌트가 렌더링될 때마다 input에 포커스
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    if (userName.trim()) {
      onNameSubmit(userName);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(); // 엔터 키 입력 시 submit
    }
  };
  const handleRefresh = () => {
    const newNickname = generateRandomNickname();
    setUserName(newNickname);
    inputRef.current.value = newNickname;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>이름을 입력해주세요.</h2>
        <div className={styles.inputContainer}>
          <input
            ref={inputRef} // ref를 input에 할당
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={styles.modalInput}
            placeholder="name"
            onKeyDown={handleKeyPress} // 엔터키 이벤트 추가
          />
          <button onClick={handleRefresh} className={styles.refreshButton}>
            🔄
          </button>
        </div>
        <button onClick={handleSubmit} className={styles.modalSubmitButton}>
          확인
        </button>
      </div>
    </div>
  );
}

export default Modal;
