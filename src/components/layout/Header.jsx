import React, { useState } from "react";
import styles from "./Header.module.scss";

const Header = () => {
  const [select, SetSelected] = useState("체크리스트");
  const handleChangeSelect = (e) => {
    SetSelected(e.target.value);
    console.log(e.target.value);
  };

  return (
    <>
      <div className={styles.Header}>
        <div>Header</div> 
        <div className={styles.MainHeaderTitleContainer}>
          <ul className={styles.MainHeaderTitle}>
            <li>읽기 권한</li>
            <li>수정 권한</li>
          </ul>
          <select onChange={handleChangeSelect}>
            <option value="일정">일정계획</option>
            <option value="지출">지출관리</option>
            <option value="체크리스트">체크리스트</option>
          </select>
        </div> 
      </div>
    </>
  );
};

export default Header;
