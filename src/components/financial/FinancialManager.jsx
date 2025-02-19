import React, { useState, useEffect } from "react";
import AddFinancial from "./AddFinancial";
import FinancialList from "./FinancialList";
import './FinancialManager.css';


// 샘플 데이터 (API 연동 전까지 사용)
const DUMMY_Financials = [
  {
    id: 1, 
    spender: '김철수',
    description: '금오름 가기', 
    amount: 50000, 
    spendAt: "2024-01-01T08:00:00", 
    images: ["https://velog.velcdn.com/images/juneyj1/post/3c47578a-99b7-4a6d-b4b0-3f189021c91c/image.jpeg"]
  },
  {
    id: 2, 
    spender: '이장군',
    description: '점심먹기', 
    amount: 40000, 
    spendAt: "2024-01-01T12:00:00",
    images: []
  },
  {
    id: 3, 
    spender: '박혁거',
    description: '오설록 티 뮤지엄 가기', 
    amount: 50000, 
    spendAt: "2024-01-02T15:30:00", 
    images: []
  },
];

const FinancialManager = () => {
  const [financials, setFinancials] = useState(DUMMY_Financials);
  const [error, setError] = useState(null);

  // API에서 데이터 가져오기 (실제 API 연동 시 주석 해제)
  /*
  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const response = await axios.get('/api/expenses');
        setFinancials(response.data);
      } catch (error) {
        console.error('지출 데이터를 가져오는 중 오류 발생:', error);
        setError('데이터를 불러오는 데 실패했습니다');
      }
    };

    fetchFinancials();
  }, []);
  */

  // 지출 추가 함수
  const addFinancial = async (formData) => {
    try {
      // 실제 API 연동 시 사용
      // const response = await axios.post('/api/expenses', formData);
      // const newFinancial = response.data;
      
      // 임시 구현 (API 연동 전)
      const newFinancial = {
        id: Date.now(),
        spender: formData.get('spender'),
        description: formData.get('description'),
        amount: Number(formData.get('amount')),
        spendAt: formData.get('spendAt'),
        images: formData.get('images') ? [URL.createObjectURL(formData.get('images'))] : [],
        createdAt: new Date().toISOString()
      };
      
      setFinancials([...financials, newFinancial]);
    } catch (error) {
      console.error('지출 추가 중 오류 발생:', error);
      setError('지출 추가에 실패했습니다');
    }
  };

  // 지출 삭제 함수
  const removeFinancial = async (id) => {
    try {
      // 실제 API 연동 시 사용
      // await axios.delete(`/api/expenses/${id}`);
      
      setFinancials(financials.filter((financial) => financial.id !== id));
    } catch (error) {
      console.error('지출 삭제 중 오류 발생:', error);
      setError('지출 삭제에 실패했습니다');
    }
  };

  // 지출 수정 함수
  const modifyFinancial = async (id, formData) => {
    try {
      // 실제 API 연동 시 사용
      // const response = await axios.put(`/api/expenses/${id}`, formData);
      // const updatedFinancial = response.data;
      
      // 임시 구현 (API 연동 전)
      const updatedFinancial = {
        id: id,
        spender: formData.get('spender'),
        description: formData.get('description'),
        amount: Number(formData.get('amount')),
        spendAt: formData.get('spendAt'),
        images: formData.get('images') 
          ? [URL.createObjectURL(formData.get('images'))] 
          : financials.find(f => f.id === id)?.images || [],
      };
      
      setFinancials(
        financials.map((financial) =>
          financial.id === id ? updatedFinancial : financial
        )
      );
    } catch (error) {
      console.error('지출 수정 중 오류 발생:', error);
      setError('지출 수정에 실패했습니다');
    }
  };

  return (
    <>
      <div className="main-frame">
        <h2 className="main-title">📅 여행 N빵 지출 관리</h2>
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