import React, { useState } from 'react';
import styles from './CheckSidebar.module.scss';

const CheckSidebar = ({ categories, selectedCategory, onSelectCategory, onUpdateCategory, onDeleteCategory }) => {
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  const handleEditClick = (e, categoryId, categoryName) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setEditingCategoryId(categoryId);
    setEditedCategoryName(categoryName);
  };

  const handleSaveEdit = (e, categoryId) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (editedCategoryName.trim()) {
      onUpdateCategory(categoryId, editedCategoryName.trim());
      setEditingCategoryId(null);
    }
  };

  const handleDeleteClick = (e, categoryId) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onDeleteCategory(categoryId);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setEditingCategoryId(null);
  };

  const handleInputChange = (e) => {
    setEditedCategoryName(e.target.value);
  };

  const handleKeyDown = (e, categoryId) => {
    if (e.key === 'Enter') {
      handleSaveEdit(e, categoryId);
    } else if (e.key === 'Escape') {
      handleCancelEdit(e);
    }
  };

  return (
    <div className="">
      <h2 className="">🚀카테고리</h2>
      <ul className={styles.categoryul}>
        {categories.map(category => (
          <li
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`${styles.categoryli} ${selectedCategory === category.id ? styles.selected : ''}`}
          >
            {editingCategoryId === category.id ? (
              <div className={styles.editContainer}>
                <input
                  type="text"
                  value={editedCategoryName}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, category.id)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  className={styles.editInput}
                />
                <div className={styles.actionButtons}>
                  <button
                    onClick={(e) => handleSaveEdit(e, category.id)}
                    className={styles.saveButton}
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className={styles.cancelButton}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.categoryItem}>
                <span className={styles.categoryName}>{category.name}</span>
                <div className={styles.categoryActions}>
                  <button
                    onClick={(e) => handleEditClick(e, category.id, category.name)}
                    className={styles.editButton}
                    title="수정"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, category.id)}
                    className={styles.deleteButton}
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckSidebar;