import React, { useState } from 'react';
import styles from './CheckSidebar.module.scss';
import ErrorModal from '../ui/Modal/ErrorModal';

const CheckSidebar = ({ categories, selectedCategory, onSelectCategory, onUpdateCategory, onDeleteCategory, hasPermission }) => {
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleEditClick = (e, categoryId, categoryName) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    
    // 권한이 없으면 편집 모드로 전환하지 않음
    if (!hasPermission) return;
    
    setEditingCategoryId(categoryId);
    setEditedCategoryName(categoryName);
  };

  const handleSaveEdit = (e, categoryId) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    
    // 권한이 없으면 저장하지 않음
    if (!hasPermission) return;
    
    if (editedCategoryName.trim()) {
      onUpdateCategory(categoryId, editedCategoryName.trim());
      setEditingCategoryId(null);
    }
  };

  const handleDeleteClick = (e, categoryId) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    
    // 권한이 없으면 삭제 모달을 열지 않음
    if (!hasPermission) return;
    
    setCategoryToDelete(categoryId);
    setModalOpen(true);
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

  const closeModal = () => {
    setModalOpen(false);
    setCategoryToDelete(null);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete);
      closeModal();
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
                  disabled={!hasPermission}
                />
                <div className={styles.actionButtons}>
                  <button
                    onClick={(e) => handleSaveEdit(e, category.id)}
                    className={styles.saveButton}
                    disabled={!hasPermission}
                    title="저장"
                  >
                    <span className={styles.buttonIcon}>💾</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className={styles.cancelButton}
                    title="취소"
                  >
                    <span className={styles.buttonIcon}>❌</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.categoryItem}>
                <span className={styles.categoryName}>{category.name}</span>
                {/* 권한이 있을 때만 수정/삭제 버튼 표시 */}
                {hasPermission && (
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
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      
      {modalOpen && (
        <ErrorModal
          title="카테고리 삭제" 
          message="정말 이 카테고리를 삭제하시겠습니까? 이 카테고리에 속한 모든 항목도 함께 삭제됩니다." 
          closeModal={closeModal} 
          onConfirm={confirmDelete} 
        />
      )}
    </div>
  );
};

export default CheckSidebar;