import React, { useState, useEffect, useRef, useContext } from "react";
import Modal from "./Modal"; // 모달 컴포넌트 임포트
import styles from "./Chat.module.css"; // CSS 모듈 임포트
import { usePermission } from "../../pages/MainLayout"; // 🔥 추가
import { useParams } from "react-router-dom";
import ChatNameContext from "../../context/chat-context";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [permission, setPermission] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const { roomCode } = useParams();

  const permissionData = usePermission();
  const { chatName, setChatName, mySessionIds, setMySessionIds } 
  = useContext(ChatNameContext);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setPermission(permissionData.permission);

    if (permissionData.permission === false) {
      setName("permission-false");
    }
  }, [permissionData]);

  useEffect(() => {

    const ws = new WebSocket(`ws://localhost:8999/ws/chat/${roomCode}`);
    setSocket(ws);

    ws.onopen = () => {
      // console.log("WebSocket 연결 완료");
      if (name) {
        const message = JSON.stringify({
          name: name,
          roomCode: roomCode,
          messages: "",
        });
        ws.send(message);
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log(data);

      if (data.type === "H") {
        setMySessionIds((prevIds) => {
          if (!prevIds.includes(data.sessionId)) {
            return [...prevIds, data.sessionId];
          }
          return prevIds;
        });
      }
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      // console.log("WebSocket 연결 종료");
    };

    return () => {
      ws.close();
    };
  }, [name]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const messageToSend = JSON.stringify({
        name: name,
        roomCode: roomCode,
        message: message,
      });
      socket.send(messageToSend);
      setMessage("");
    }
  };

  const handleNameSubmit = (userName) => {
    setChatName(userName);
    setName(userName);
    setShowModal(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (!showModal && inputRef.current) {
      inputRef.current.focus();
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showModal]);

  const randMessage = (msg, index) => {
    const data = JSON.parse(msg);
    return (
      <>
        <div
          className={`${styles.sender} ${
             mySessionIds.includes(data.sessionId)
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
              : mySessionIds.includes(data.sessionId)
              ? `${styles.message} ${styles.myMessage}`
              : `${styles.message} ${styles.otherMessage}`
          }`}
        >
          <p>{data.type === "M" ? data.message : data.message}</p>
        </div>
      </>
    );
  };

  return (<>
      {showModal && permission && <Modal onNameSubmit={handleNameSubmit} />}
    <div className={styles.chatContainer}>
      <h1 className={styles.title}>CHATTING ROOM</h1>
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div key={index}>{randMessage(msg, index)}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
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


  </>
  );
}

export default Chat;
