import React, { useState, useEffect } from 'react';
import CheckListAdd from './CheckListAdd';
import CheckList from './CheckList';
import CheckSidebar from './CheckSidebar';
import styles from './CheckListManager.module.scss';
import CheckListSearch from './CheckListSearch';

const CheckListManager = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [checklistItems, setChecklistItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 룸 코드와 URL 정보
  const roomCode = 'ce89baca';
  const url = '174039428319e605f1';
  const baseUrl = `http://localhost:8999/api/fish/check/${roomCode}/${url}`;

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(baseUrl);
        
        if (!response.ok) {
          throw new Error('서버에서 데이터를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        
        // 카테고리 데이터 설정
        if (data && data.category) {
          setCategories(data.category.map(cat => ({
            id: cat.categoryId,
            name: cat.content,
            category: cat.content,
            content: cat.content
          })));
          
          // 체크리스트 아이템 설정
          const itemsMap = {};
          data.category.forEach(cat => {
            itemsMap[cat.categoryId] = cat.checkListItemList || [];
          });
          
          setChecklistItems(itemsMap);
          
          // 첫 번째 카테고리 선택(있는 경우)
          if (data.category.length > 0) {
            setSelectedCategoryId(data.category[0].categoryId);
          }
        }
      } catch (err) {
        console.error('Error fetching checklist data:', err);
        setError('체크리스트 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddCategory = async (newCategoryContent) => {
    try {
      // 올바른 API 경로를 사용합니다
      const categoryUrl = `http://localhost:8999/api/fish/check/category/${roomCode}/${url}`;
      console.log("카테고리 추가 요청 URL:", categoryUrl);
      console.log("카테고리 추가 요청 본문:", JSON.stringify({ content: newCategoryContent }));
      
      // API를 통해 새 카테고리 추가 요청
      const response = await fetch(categoryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newCategoryContent
        })
      });
      
      console.log("응답 상태:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("응답 에러:", errorText);
        throw new Error(`카테고리 추가에 실패했습니다. 상태 코드: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("응답 데이터:", data);
      
      // 성공적으로 추가된 경우, 응답에서 카테고리 ID를 가져와 로컬 상태 업데이트
      if (data && data.categoryId) {
        const newCategoryObj = { 
          id: data.categoryId, 
          name: newCategoryContent,
          category: newCategoryContent,
          content: newCategoryContent
        };
        
        setCategories([...categories, newCategoryObj]);
        setChecklistItems({ ...checklistItems, [data.categoryId]: [] });
        setSelectedCategoryId(data.categoryId);
      } else {
        console.error("카테고리 ID가 응답에 포함되지 않았습니다:", data);
        alert("카테고리 추가는 성공했지만, 응답 형식이 예상과 다릅니다.");
      }
    } catch (err) {
      console.error('Error adding category:', err);
      alert(`카테고리 추가 중 오류가 발생했습니다: ${err.message}`);
    }
  };

  const handleAddChecklistItem = async (categoryId, item) => {
    try {
      // API를 통해 새 체크리스트 아이템 추가 요청
      const response = await fetch(`${baseUrl}/category/${categoryId}/item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: item.content,
          assignee: item.assignee
        })
      });
      
      if (!response.ok) {
        throw new Error('체크리스트 항목 추가에 실패했습니다.');
      }
      
      const data = await response.json();
      
      // 성공적으로 추가된 경우, 응답에서 아이템 ID를 가져와 로컬 상태 업데이트
      if (data && data.id) {
        setChecklistItems({
          ...checklistItems,
          [categoryId]: [...(checklistItems[categoryId] || []), {
            id: data.id,
            content: item.content,
            assignee: item.assignee,
            completed: false
          }]
        });
      }
    } catch (err) {
      console.error('Error adding checklist item:', err);
      alert('체크리스트 항목 추가 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteItem = async (categoryId, itemId) => {
    try {
      // API를 통해 체크리스트 아이템 삭제 요청
      const response = await fetch(`${baseUrl}/category/${categoryId}/item/${itemId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('체크리스트 항목 삭제에 실패했습니다.');
      }
      
      // 로컬 상태 업데이트
      setChecklistItems({
        ...checklistItems,
        [categoryId]: checklistItems[categoryId].filter(item => item.id !== itemId),
      });
    } catch (err) {
      console.error('Error deleting checklist item:', err);
      alert('체크리스트 항목 삭제 중 오류가 발생했습니다.');
    }
  };
  
  const handleUpdateItem = async (categoryId, itemId, updatedItem) => {
    try {
      // API를 통해 체크리스트 아이템 업데이트 요청
      const response = await fetch(`${baseUrl}/category/${categoryId}/item/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: updatedItem.content,
          assignee: updatedItem.assignee
        })
      });
      
      if (!response.ok) {
        throw new Error('체크리스트 항목 업데이트에 실패했습니다.');
      }
      
      // 로컬 상태 업데이트
      setChecklistItems({
        ...checklistItems,
        [categoryId]: checklistItems[categoryId].map(item =>
          item.id === itemId ? { ...item, ...updatedItem } : item
        ),
      });
    } catch (err) {
      console.error('Error updating checklist item:', err);
      alert('체크리스트 항목 업데이트 중 오류가 발생했습니다.');
    }
  };
  
  const handleToggleComplete = async (categoryId, itemId) => {
    try {
      // 현재 아이템의 완료 상태를 찾습니다
      const currentItem = checklistItems[categoryId].find(item => item.id === itemId);
      const newCompletedStatus = !currentItem.completed;
      
      // API를 통해 체크리스트 아이템 완료 상태 업데이트 요청
      const response = await fetch(`${baseUrl}/category/${categoryId}/item/${itemId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: newCompletedStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('체크리스트 항목 완료 상태 변경에 실패했습니다.');
      }
      
      // 로컬 상태 업데이트
      setChecklistItems({
        ...checklistItems,
        [categoryId]: checklistItems[categoryId].map(item =>
          item.id === itemId ? { ...item, completed: newCompletedStatus } : item
        )
      });
    } catch (err) {
      console.error('Error toggling checklist item completion:', err);
      alert('체크리스트 항목 완료 상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 선택된 카테고리 객체 찾기
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  // 선택된 카테고리의 이름 (표시용)
  const selectedCategoryName = selectedCategory ? selectedCategory.name : null;

  if (isLoading) {
    return <div className={styles.loading}>데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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
          categoryName={selectedCategoryName}
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