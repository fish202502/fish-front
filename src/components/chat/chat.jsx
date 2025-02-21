import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal'; // 모달 컴포넌트 임포트
import styles from './Chat.module.css'; // CSS 모듈 임포트
import { useParams } from 'react-router-dom';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [socket, setSocket] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const { roomCode } = useParams(); 

  // 인풋창에 대한 ref 생성
  const inputRef = useRef(null);
  // 메시지 컨테이너를 위한 ref 생성
  const messagesEndRef = useRef(null);

  console.log(roomCode);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8999/ws/chat/${roomCode}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket 연결 완료');
      if (name) {
        const message = JSON.stringify({
          name: name,
          roomCode: roomCode,
          messages: ""
        });
        ws.send(message); // JSON 문자열로 메시지 전송
      }
    };

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    return () => {
      ws.close();
    };
  }, [name]); // name이 변경될 때마다 WebSocket 연결 재시작

  const sendMessage = () => {
    if (message.trim() && socket) {
      const messageToSend = JSON.stringify({
        name: name,
        roomCode: roomCode,
        message: message // 실제 메시지 내용 추가
      });
      socket.send(messageToSend); // 메시지 내용도 함께 전송
      setMessage(''); // 메시지 전송 후 입력창 초기화
    }
  };

  const handleNameSubmit = (userName) => {
    setName(userName);
    setShowModal(false);
  };

  // 엔터키로 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    // 모달이 닫히고 나서 인풋창에 포커스
    if (!showModal && inputRef.current) {
      inputRef.current.focus();
    }

    // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showModal]); // 메시지가 변경될 때마다 실행

  return (
    <div className={styles.chatContainer}>
      {showModal && <Modal onNameSubmit={handleNameSubmit} />}
      <h1 className={styles.title}>대화방</h1>
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${msg.includes(name) ? styles.myMessage : styles.otherMessage}`}
          >
            <p>{msg}</p>
          </div>
        ))}
        {/* 메시지 끝에 빈 div를 추가하여 스크롤이 맨 아래로 이동하도록 함 */}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          ref={inputRef} // 인풋에 ref 연결
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메세지를 입력하세요."
          className={styles.input}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
