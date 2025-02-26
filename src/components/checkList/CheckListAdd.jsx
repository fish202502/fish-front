import { useState } from "react";
import styles from "./CheckListAdd.module.scss";

const CheckListAdd = ({ onAddCategory, categories, disabled }) => {
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 권한이 없는 경우 제출 불가
    if (disabled) {
      return;
    }
    
    const trimmedCategory = newCategory.trim();
    
    if (trimmedCategory) {
      // 카테고리 중복 확인 - 카테고리 구조 안전하게 확인
      const categoryExists = categories.some(category => {
        // 여러 가능한 속성 이름 확인
        const categoryName = category.name || category.category || category.content;
        return categoryName && categoryName.toLowerCase() === trimmedCategory.toLowerCase();
      });
      
      if (categoryExists) {
        setError("이미 존재하는 카테고리입니다");
        return;
      }
      
      onAddCategory(trimmedCategory);
      setNewCategory("");
      setError("");
    }
  };

  return (
    <div className={`${styles.addCategoryContainer} ${disabled ? styles.disabled : ''}`}>
      <form onSubmit={handleSubmit} className={styles.addCategoryForm}>
        <input
          type="text"
          value={newCategory}
          name="content"
          onChange={(e) => {
            if (!disabled) {
              setNewCategory(e.target.value);
              setError(""); // 입력 시 에러 메시지 초기화
            }
          }}
          placeholder="새 카테고리 추가"
          className={styles.inputField}
          disabled={disabled}
        />
        <button 
          type="submit" 
          className={`${styles.addButton} ${disabled ? styles.disabledButton : ''}`}
          disabled={disabled || !newCategory.trim()}
        >
          추가
        </button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {disabled && (
        <p className={styles.permissionMessage}>
          읽기 권한만 있어 카테고리를 추가할 수 없습니다.
        </p>
      )}
    </div>
  );
};

export default CheckListAdd;