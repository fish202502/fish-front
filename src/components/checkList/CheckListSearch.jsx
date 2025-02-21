import React, { useState } from 'react';
import styles from './CheckListSearch.module.scss';

const CheckListSearch = ({ categories, onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // 검색어와 일치하는 카테고리 찾기
      const foundCategory = categories.find(
        category => category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (foundCategory) {
        onSelectCategory(foundCategory.name);
        setSearchTerm("");
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setNotFound(false);
          }}
          placeholder='검색할 카테고리를 입력하세요'
          className={styles.searchInput}
        />
        <button 
          type="submit" 
          className={styles.searchButton}
          disabled={!searchTerm.trim()}
        >
          검색
        </button>
      </form>
      {notFound && (
        <p className={styles.notFound}>검색하신 카테고리가 없습니다.</p>
      )}
    </div>
  );
};

export default CheckListSearch;