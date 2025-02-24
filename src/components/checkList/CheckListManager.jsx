import React, { useState } from 'react';
import CheckListAdd from './CheckListAdd';
import CheckList from './CheckList';
import CheckSidebar from './CheckSidebar';
import styles from './CheckListManager.module.scss';
import CheckListSearch from './CheckListSearch';


const CheckListManager = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [checklistItems, setChecklistItems] = useState({});

  const handleAddCategory = (newCategoryContent) => {
    const categoryId = `category_${Date.now()}`;
    const newCategoryObj = { 
      id: categoryId, 
      name: newCategoryContent,
      category: newCategoryContent, // 백엔드 DTO와 일치하는 필드
      content: newCategoryContent   // 백엔드 JsonProperty와 일치하는 필드
    };
    
    setCategories([...categories, newCategoryObj]);
    setChecklistItems({ ...checklistItems, [categoryId]: [] });
    setSelectedCategoryId(categoryId);
  };

  const handleAddChecklistItem = (categoryId, item) => {
    setChecklistItems({
      ...checklistItems,
      [categoryId]: [...(checklistItems[categoryId] || []), {
        id: Date.now(),
        content: item.content,
        assignee: item.assignee,
        completed: false
      }]
    });
  };

  const handleDeleteItem = (categoryId, itemId) => {
    setChecklistItems({
      ...checklistItems,
      [categoryId]: checklistItems[categoryId].filter(item => item.id !== itemId),
    });
  };
  
  const handleUpdateItem = (categoryId, itemId, updatedItem) => {
    setChecklistItems({
      ...checklistItems,
      [categoryId]: checklistItems[categoryId].map(item =>
        item.id === itemId ? { ...item, ...updatedItem } : item
      ),
    });
  };
  
  const handleToggleComplete = (categoryId, itemId) => {
    setChecklistItems({
      ...checklistItems,
      [categoryId]: checklistItems[categoryId].map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    });
  };

  // 선택된 카테고리 객체 찾기
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  // 선택된 카테고리의 이름 (표시용)
  const selectedCategoryName = selectedCategory ? selectedCategory.name : null;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.sidebar}>
        <div className={styles.searchContainer}>
          <CheckListSearch 
            categories={categories}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>
        <CheckSidebar 
          categories={categories}
          selectedCategory={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <CheckListAdd 
          onAddCategory={handleAddCategory} 
          categories={categories}
        />
      </div>
     
      <div className={styles.managerContent}><p className={styles.mainTitleName}>📝체크리스트</p>
        <CheckList
          categoryId={selectedCategoryId}
          items={checklistItems[selectedCategoryId] || []}
          categoryName={selectedCategoryName} // 카테고리 이름 전달
          onAddItem={handleAddChecklistItem}
          onToggleComplete={handleToggleComplete}
          onDeleteItem={handleDeleteItem}
          onUpdateItem={handleUpdateItem}
        />
      </div>
    </div>
  );
};

export default CheckListManager;