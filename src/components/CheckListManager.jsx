import React, { useState } from 'react';
import CheckListAdd from './CheckListAdd';
import CheckList from './CheckList';
import CheckSidebar from './CheckSidebar';
import styles from './CheckListManager.module.scss';

const CheckListManager = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [checklistItems, setChecklistItems] = useState({});

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, { id: Date.now(), name: newCategory }]);
    setChecklistItems({ ...checklistItems, [newCategory]: [] });
  };

  const handleAddChecklistItem = (category, item) => {
    setChecklistItems({
      ...checklistItems,
      [category]: [...(checklistItems[category] || []), {
        id: Date.now(),
        text: item.text,
        assignee: item.assignee,
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
        <CheckListAdd onAddCategory={handleAddCategory} />
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
