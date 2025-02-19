import React, { useState } from 'react';
import CheckListAdd from './CheckListAdd';
import CheckList from './CheckList';
import CheckSidebar from './CheckSidebar';
import styles from './CheckListManager.module.scss';
import CheckListSearch from './CheckListSearch';

const CheckListManager = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [checklistItems, setChecklistItems] = useState({});

  const handleAddCategory = (newCategory) => {
    const newCategoryObj = { id: Date.now(), name: newCategory };
    setCategories([...categories, newCategoryObj]);
    setChecklistItems({ ...checklistItems, [newCategory]: [] });
    // 새 카테고리 생성 후 자동으로 선택
    setSelectedCategory(newCategory);
  };

  const handleAddChecklistItem = (category, item) => {
    setChecklistItems({
      ...checklistItems,
      [category]: [...(checklistItems[category] || []), {
        id: Date.now(),
        text: item.text,
        name: item.name,
        completed: false
      }]
    });
  };

  const handleDeleteItem = (category, itemId) => {
    setChecklistItems({
      ...checklistItems,
      [category]: checklistItems[category].filter(item => item.id !== itemId),
    });
  };
  
  const handleUpdateItem = (category, itemId, updatedItem) => {
    setChecklistItems({
      ...checklistItems,
      [category]: checklistItems[category].map(item =>
        item.id === itemId ? { ...item, ...updatedItem } : item
      ),
    });
  };
  
  const handleToggleComplete = (category, itemId) => {
    setChecklistItems({
      ...checklistItems,
      [category]: checklistItems[category].map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    });
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.sidebar}>
        <CheckSidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <CheckListAdd 
          onAddCategory={handleAddCategory} 
          categories={categories}
        />
      </div>
      <div>
        <CheckListSearch/>
      </div>
      <div className={styles.content}>
        {selectedCategory && (
          <CheckList
            category={selectedCategory}
            items={checklistItems[selectedCategory] || []}
            onAddItem={handleAddChecklistItem}
            onToggleComplete={handleToggleComplete}
            onDeleteItem={handleDeleteItem}
            onUpdateItem={handleUpdateItem}
          />
        )}
      </div>
    </div>
  );
};

export default CheckListManager;