import React from 'react';
import FinancialForm from './FinancialForm';

const FinancialTracker = () => {
  const Dummydata = [
    {
      name: '김철수', 
    },
    {
      name: '김민수'
    },
    {
      name:'박상현'
    }
    ,
    {
      name:'박상현'
    }
  ];

 
  return (
    <>
      <h2>지출관리</h2>
 
      {Dummydata.map((data, index) => (
        <FinancialForm key={index} name={data.name}  />
      ))}
    </>
  );
};

export default FinancialTracker;
