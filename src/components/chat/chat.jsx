import React, { useState, useEffect, useRef, use, useContext } from "react";
import Modal from "./Modal"; // 모달 컴포넌트 임포트
import styles from "./Chat.module.css"; // CSS 모듈 임포트
import { usePermission } from "../../pages/MainLayout"; // 🔥 추가
import { data, useParams } from "react-router-dom";
import ChatNameContext from "../../context/chat-context";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [mySessionId, setMySessionId] = useState("");
  const [permission, setPermission] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const { roomCode, url } = useParams();

  const permissionData = usePermission();

  const {chatName,setChatName} = useContext(ChatNameContext);

  // 인풋창에 대한 ref 생성
  const inputRef = useRef(null);
  // 메시지 컨테이너를 위한 ref 생성
  const messagesEndRef = useRef(null);

  // 권한 체크
  useEffect(() => {
    setPermission(permissionData.permission);

    if (permissionData.permission === false) {
      setName("permission-false");
    }
  }, []);

  useEffect(() => {
    console.log(roomCode);

    const ws = new WebSocket(`ws://localhost:8999/ws/chat/${roomCode}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket 연결 완료");
      if (name) {
        const message = JSON.stringify({
          name: name,
          roomCode: roomCode,
          messages: "",
        });
        ws.send(message); // JSON 문자열로 메시지 전송
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // 처음 인삿말 정보로 세션id 저장
      if (data.type === "H") {
        setMySessionId(data.sessionId);
      }
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket 연결 종료");
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
        message: message, // 실제 메시지 내용 추가
      });
      socket.send(messageToSend); // 메시지 내용도 함께 전송
      setMessage(""); // 메시지 전송 후 입력창 초기화
    }
  };

  const handleNameSubmit = (userName) => {
    setChatName(userName);
    setName(userName);
    setShowModal(false);
  };

  // 엔터키로 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
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

  // 메세지 처리
  const randMessage = (msg, index) => {
    const data = JSON.parse(msg);
    return (
      <>
        <div
          className={`${styles.sender} ${
            data.sender === name && data.sessionId === mySessionId
              ? styles.myName
              : styles.otherName
          }`}
        >
          {data.type === "M" ? data.sender : ""}
        </div>
        <div
          className={`${
            data.type === "H"
              ? styles.systemMessage
              : data.sender === name && data.sessionId === mySessionId
              ? `${styles.message} ${styles.myMessage}`
              : `${styles.message} ${styles.otherMessage}`
          }`}
        >
          <p>{data.type === "M" ? data.message : data.message}</p>
        </div>
      </>
    );
  };

  return (
    <div className={styles.chatContainer}>
      {showModal && permission && <Modal onNameSubmit={handleNameSubmit} />}
      <h1 className={styles.title}>대화방</h1>
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div key={index}>{randMessage(msg, index)}</div>
        ))}
        {/* 메시지 끝에 빈 div를 추가하여 스크롤이 맨 아래로 이동하도록 함 */}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          ref={inputRef} // 인풋에 ref 연결
          type="text"
          disabled={!permission}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메세지를 입력하세요."
          className={styles.input}
          onKeyDown={handleKeyDown}
        />
        <button
          disabled={!permission}
          onClick={sendMessage}
          className={styles.sendButton}
        >
          보내기
        </button>
      </div>
    </div>
  );
}

export default Chat;
