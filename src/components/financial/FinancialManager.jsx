import React, { useState, useEffect } from "react";
import AddFinancial from "./AddFinancial";
import FinancialList from "./FinancialList";
import "./FinancialManager.css";
import { useParams } from "react-router-dom";
import { EXPENSE_API_URL } from "../../config/host-config";

const FinancialManager = () => {
  const [financials, setFinancials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API 상수
  const ROOM_CODE = "10b507dd";
  const URL_ID = "1740453889520469b6";
  
  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchFinancials = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // API 호출
        const response = await fetch(`${EXPENSE_API_URL}/${ROOM_CODE}/${URL_ID}`);

        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다");
        }

        const data = await response.json();
        console.log("불러온 데이터:", data);

        // 데이터 구조 확인 및 변환
        if (
          data &&
          Array.isArray(data) &&
          data.length > 0 &&
          data[0].expenseItemList
        ) {
          // API 응답 구조에 맞게 데이터 변환
          const formattedData = data[0].expenseItemList.map((item) => ({
            id: item.expenseItemId || item.id || Math.random().toString(),
            spender: item.spender,
            description: item.description,
            amount: item.amount,
            spendAt: item.spendAt,
            images:
              item.receiptList && item.receiptList.length > 0
                ? item.receiptList.map((receipt) => receipt.url)
                : [],
          }));

          // 날짜 기준으로 정렬
          const sortedData = formattedData.sort((a, b) => {
            const dateA = new Date(a.spendAt);
            const dateB = new Date(b.spendAt);
            return dateA - dateB; // 오름차순 정렬 (과거 -> 최근)
          });

          setFinancials(sortedData);
        } else {
          console.log("데이터 형식이 예상과 다릅니다:", data);
          setError("데이터 형식이 올바르지 않습니다.");
        }
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
        setError("데이터를 불러오는 데 실패했습니다: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancials();
  }, []);

  // 지출 추가 함수
  const addFinancial = async (formData) => {
    try {
      setIsLoading(true);

      // 이미 FormData 객체가 준비되어 있으니, 다른 처리 없이 그대로 전송
      const response = await fetch(`${EXPENSE_API_URL}/${ROOM_CODE}/${URL_ID}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("항목 추가에 실패했습니다");
      }

      const result = await response.json();
      console.log("추가된 항목 응답:", result);

      // 데이터 다시 불러오기
      const refetchResponse = await fetch(
        `${EXPENSE_API_URL}/${ROOM_CODE}/${URL_ID}`
      );
      if (!refetchResponse.ok) {
        throw new Error("데이터 새로고침에 실패했습니다");
      }
      
      // 데이터 다시 가져와서 상태 업데이트
      const refetchData = await refetchResponse.json();
      if (
        refetchData &&
        Array.isArray(refetchData) &&
        refetchData.length > 0 &&
        refetchData[0].expenseItemList
      ) {
        const formattedData = refetchData[0].expenseItemList.map((item) => ({
          id: item.expenseItemId || item.id || Math.random().toString(),
          spender: item.spender,
          description: item.description,
          amount: item.amount,
          spendAt: item.spendAt,
          images:
            item.receiptList && item.receiptList.length > 0
              ? item.receiptList.map((receipt) => receipt.url)
              : [],
        }));

        // 날짜 기준으로 정렬
        const sortedData = formattedData.sort((a, b) => {
          const dateA = new Date(a.spendAt);
          const dateB = new Date(b.spendAt);
          return dateA - dateB; // 오름차순 정렬
        });

        setFinancials(sortedData);
      }
    } catch (error) {
      console.error("지출 추가 중 오류 발생:", error);
      setError("지출 추가에 실패했습니다: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 지출 삭제 함수
  const removeFinancial = async (id) => {
    try {
      setIsLoading(true);

      // API 호출
      const response = await fetch(
        `${EXPENSE_API_URL}/${ROOM_CODE}/${URL_ID}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("항목 삭제에 실패했습니다");
      }

      // 로컬 상태 업데이트 - 삭제된 항목 제거
      setFinancials((prevFinancials) =>
        prevFinancials.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("지출 삭제 중 오류 발생:", error);
      setError("지출 삭제에 실패했습니다: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 지출 수정 함수
  const modifyFinancial = async (id, formData) => {
    try {
      setIsLoading(true);

      // API 호출
      const response = await fetch(
        `${EXPENSE_API_URL}/${ROOM_CODE}/${URL_ID}/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      console.log("응답 상태:", response.status);

      if (!response.ok) {
        // 오류 응답의 텍스트 내용을 확인
        const errorText = await response.text();
        console.error('서버 오류 응답:', errorText);
        throw new Error(`항목 수정에 실패했습니다 (${response.status})`);
      }

      // 데이터 다시 불러오기
      const refetchResponse = await fetch(
        `${EXPENSE_API_URL}/${ROOM_CODE}/${URL_ID}`
      );
      if (!refetchResponse.ok) {
        throw new Error("데이터 새로고침에 실패했습니다");
      }

      const refetchData = await refetchResponse.json();
      if (
        refetchData &&
        Array.isArray(refetchData) &&
        refetchData.length > 0 &&
        refetchData[0].expenseItemList
      ) {
        const formattedData = refetchData[0].expenseItemList.map((item) => ({
          id: item.expenseItemId || item.id || Math.random().toString(),
          spender: item.spender,
          description: item.description,
          amount: item.amount,
          spendAt: item.spendAt,
          images:
            item.receiptList && item.receiptList.length > 0
              ? item.receiptList.map((receipt) => receipt.url)
              : [],
        }));

        // 날짜 기준으로 정렬
        const sortedData = formattedData.sort((a, b) => {
          const dateA = new Date(a.spendAt);
          const dateB = new Date(b.spendAt);
          return dateA - dateB; // 오름차순 정렬 (과거 -> 최근)
        });

        setFinancials(sortedData);
      }
    } catch (error) {
      console.error("지출 수정 중 오류 발생:", error);
      setError("지출 수정에 실패했습니다: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="main-frame">
        <h2 className="main-title">📅 여행 지출 관리</h2>

        {/* 로딩 표시 */}
        {isLoading && <div className="loading">데이터를 불러오는 중...</div>}

        {/* 오류 표시 */}
        {error && <div className="error-message">{error}</div>}

        <div className="frame">
          <AddFinancial addFinancial={addFinancial} />
          <FinancialList
            financials={financials}
            removeFinancial={removeFinancial}
            modifyFinancial={modifyFinancial}
          />
        </div>
      </div> 
    </>
  );
};

export default FinancialManager;