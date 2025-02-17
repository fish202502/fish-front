import { useState } from "react";
import styles from "./CheckListAdd.module.scss";

const CheckListAdd = ({ onAddCategory }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addCategoryForm}>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="새 카테고리 추가"
        className={styles.inputField}
      />
      <button 
        type="submit" 
        className={styles.addButton}
        disabled={!newCategory.trim()}
      >
        추가
      </button>
    </form>
  );
};

export default CheckListAdd;
