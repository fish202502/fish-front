import React, { useState, useEffect } from "react";
import AddFinancial from "./AddFinancial";
import FinancialList from "./FinancialList";
import './FinancialManager.css';


// 샘플 데이터 (API 연동 전까지 사용)
const DUMMY_Financials = [
  {
      expenseId: "1c48d8bb-a4fa-4477-829e-06a56c514457",
      spender: "지수",
      amount: 15000.00,
      description: "케이크",
      spendAt: "2025-02-22T14:30:00",
      receiptList: [
          {
              receiptId: "022325ec-9cf5-4eff-b639-5456a3563371",
              url: "/uploads/d8bffb19-4eaf-4e8b-8c05-874ed15e3b00_favicon.png"
          }
      ]
  },
  {
      expenseId: "16a2e958-6cdf-48e0-9062-87c821cc5d1b",
      spender: "지수",
      amount: 15000.00,
      description: "케이크",
      spendAt: "2025-02-22T14:30:00",
      receiptList: [
          {
              receiptId: "847aa86e-27dc-429f-a888-abfb3a6d87a8",
              url: "/uploads/3739c9e9-e655-425b-a7c5-7d50899e31f4_favicon.png"
          }
      ]
  }
]

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
        <h2 className="main-title">📅 여행 지출 관리</h2>
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