import React, { useEffect } from "react";
import "./kakao.css"; 

const KakaoShareButton = ({button,url}) => {
  
  useEffect(() => {
    
    const createKakaoButton = () => {
      if (!window.Kakao || !window.Kakao.Link) {
        console.error("Kakao SDK가 정상적으로 로드되지 않았습니다.");
        return;
      }
      console.log("✅ Kakao SDK 로드 완료!");

      if (!window.Kakao.isInitialized()) {
        console.log("✅ Kakao SDK 초기화 진행!");
        window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
      }

     console.log("url : ",url);
     
      if (!document.querySelector("#kakao-link-btn")) return;

      window.Kakao.Link.createDefaultButton({
        container: "#kakao-link-btn",
        objectType: "feed",
        content: {
          title: "Man Go",
          description: "새로운 여행이 만들어졌습니다! 들어와서 함께 공유해요!",
          imageUrl: "",
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
        buttons: [
          {
            title: "웹으로 보기",
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      });
    };

    // ✅ Kakao SDK 로드
    if (!window.Kakao) {
      console.log("📌 Kakao SDK 스크립트 로드 시작!");
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.js";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        console.log("📌 Kakao SDK 스크립트 로드 완료!");
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
        }
        createKakaoButton();
      };
    } else {
      createKakaoButton();
    }
  }, [button]);

  return (
    <div className="kakao-share-button">
      <button id="kakao-link-btn">
        공유하기
      </button>
    </div>
  );
};

export default KakaoShareButton;
