import React, { useState, useEffect } from "react";
import AddFinancial from "./AddFinancial";
import FinancialList from "./FinancialList";
import './FinancialManager.css';

const FinancialManager = () => {
  const [financials, setFinancials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API 상수
  const ROOM_CODE = 'd8df09f5';
  const URL_ID = '1739944073733eb7c6';
  const API_BASE_URL = 'http://localhost:8999/api/fish/expense';

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchFinancials = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // API 호출
        const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`);
        
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다');
        }
        
        const data = await response.json();
        console.log('불러온 데이터:', data);
        
        // 데이터 구조 확인 및 변환
        if (data && Array.isArray(data) && data.length > 0 && data[0].expenseItemList) {
          // API 응답 구조에 맞게 데이터 변환
          const formattedData = data[0].expenseItemList.map(item => ({
            id: item.expenseItemId || item.id || Math.random().toString(),
            spender: item.spender,
            description: item.description,
            amount: item.amount,
            spendAt: item.spendAt,
            images: item.receiptList && item.receiptList.length > 0 
              ? item.receiptList.map(receipt => receipt.url) 
              : []
          }));
          
          setFinancials(formattedData);
        } else {
          console.log('데이터 형식이 예상과 다릅니다:', data);
          setError('데이터 형식이 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
        setError('데이터를 불러오는 데 실패했습니다: ' + error.message);
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
    // Content-Type을 지정하지 않으면 브라우저가 자동으로 multipart/form-data로 설정
    const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`, {
      method: 'POST',
      body: formData  
    });

    if (!response.ok) {
      throw new Error('항목 추가에 실패했습니다');
    }

    // 이하 코드는 그대로 유지
    const result = await response.json();
    console.log('추가된 항목 응답:', result);
    
    // 데이터 다시 불러오기
    const refetchResponse = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`);
    if (!refetchResponse.ok) {
      throw new Error('데이터 새로고침에 실패했습니다');
    }
    
    const refetchData = await refetchResponse.json();
    // 이하 코드는 그대로 유지
  } catch (error) {
    console.error('지출 추가 중 오류 발생:', error);
    setError('지출 추가에 실패했습니다: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};
  // 지출 삭제 함수
  const removeFinancial = async (id) => {
    try {
      setIsLoading(true);
      
      // API 호출
      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('항목 삭제에 실패했습니다');
      }

      // 로컬 상태 업데이트
      setFinancials(prevFinancials => 
        prevFinancials.filter(item => item.id !== id)
      );
      
    } catch (error) {
      console.error('지출 삭제 중 오류 발생:', error);
      setError('지출 삭제에 실패했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 지출 수정 함수
  const modifyFinancial = async (id, formData) => {
    try {
      setIsLoading(true);
      
      // API 호출
      const response = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error('항목 수정에 실패했습니다');
      }

      // 응답 데이터 받기
      const result = await response.json();
      console.log('수정된 항목 응답:', result);

      // 데이터 다시 불러오기 (대안: 응답 기반 로컬 상태 업데이트)
      const refetchResponse = await fetch(`${API_BASE_URL}/${ROOM_CODE}/${URL_ID}`);
      if (!refetchResponse.ok) {
        throw new Error('데이터 새로고침에 실패했습니다');
      }
      
      const refetchData = await refetchResponse.json();
      if (refetchData && Array.isArray(refetchData) && refetchData.length > 0 && refetchData[0].expenseItemList) {
        const formattedData = refetchData[0].expenseItemList.map(item => ({
          id: item.expenseItemId || item.id || Math.random().toString(),
          spender: item.spender,
          description: item.description,
          amount: item.amount,
          spendAt: item.spendAt,
          images: item.receiptList && item.receiptList.length > 0 
            ? item.receiptList.map(receipt => receipt.url) 
            : []
        }));
        
        setFinancials(formattedData);
      }
    } catch (error) {
      console.error('지출 수정 중 오류 발생:', error);
      setError('지출 수정에 실패했습니다: ' + error.message);
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