import React, { useState, useEffect, useRef } from 'react';
import styles from './Modal.module.css'; // CSS 모듈 임포트

function Modal({ onNameSubmit }) {
  const [userName, setUserName] = useState('');
  const inputRef = useRef(null); // input에 대한 참조를 생성

  useEffect(() => {
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
    if (e.key === 'Enter') {
      handleSubmit(); // 엔터 키 입력 시 submit
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>이름을 입력해주세요.</h2>
        <input
          ref={inputRef} // ref를 input에 할당
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={styles.modalInput}
          placeholder="name"
          onKeyDown={handleKeyPress} // 엔터키 이벤트 추가
        />
        <button onClick={handleSubmit} className={styles.modalSubmitButton}>
          확인
        </button>
      </div>
    </div>
  );
}

export default Modal;
