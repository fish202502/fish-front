import React, { useRef, useState } from 'react'
import './ErrorModal.css'

const ErrorModal = () => {
  const[modalOpen, setModalOpen] = useState('');
  const modalBackground = useRef();

  return (
    <>
   <div className={'btn-wrapper'}>
        
        <button className={'modal-open-btn'} onClick={() => setModalOpen(true)}>
          모달 열기
        </button>
      </div>
      {
        modalOpen &&
        <div className={'modal-container'} ref={modalBackground} onClick={e => {
          if (e.target === modalBackground.current) {
            setModalOpen(false);
          }
        }}>
          <div className={'modal-content'}>
          <header title ={title}>
          
        </header>
            <p>리액트로 모달 구현하기</p>
            <button className={'modal-close-btn'} onClick={() => setModalOpen(false)}>
              모달 닫기
            </button>
          </div>
        </div>
      }
  </>
  )
}

export default ErrorModal