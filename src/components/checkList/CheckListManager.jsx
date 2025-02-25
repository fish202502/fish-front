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
  const roomCode = '8b3bc5c7';
  const url = '1740448140214cf114';
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
          
          // 체크리스트 아이템 설정 - 서버 데이터 형식에서 클라이언트 형식으로 변환
          const itemsMap = {};
          data.category.forEach(cat => {
            if (cat.checkListItemList) {
              itemsMap[cat.categoryId] = cat.checkListItemList.map(item => ({
                id: item.checkListItemId,
                checkListItemId: item.checkListItemId,
                content: item.content,
                assignee: item.assignee,
                category: item.category,
                isChecked: item.isChecked,
                completed: item.isChecked // isChecked 값을 completed로 복사
              }));
            } else {
              itemsMap[cat.categoryId] = [];
            }
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
      // 올바른 API 경로 사용
      const itemUrl = `http://localhost:8999/api/fish/check/${roomCode}/${url}`;
      console.log("체크리스트 아이템 추가 요청 URL:", itemUrl);
      console.log("체크리스트 아이템 추가 요청 본문:", JSON.stringify({
        categoryId: categoryId,
        assignee: item.assignee,
        content: item.content
      }));
      
      // API를 통해 새 체크리스트 아이템 추가 요청
      const response = await fetch(itemUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: categoryId,
          assignee: item.assignee,
          content: item.content
        })
      });
      
      console.log("응답 상태:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("응답 에러:", errorText);
        throw new Error(`체크리스트 항목 추가에 실패했습니다. 상태 코드: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("응답 데이터:", data);
      
      // 체크리스트 아이템 ID 결정
      const checkListItemId = data.checkListItemId || data.id || Date.now();
      
      // 성공적으로 추가된 경우, 로컬 상태 업데이트
      setChecklistItems({
        ...checklistItems,
        [categoryId]: [...(checklistItems[categoryId] || []), {
          id: checkListItemId,
          checkListItemId: checkListItemId, // 서버 ID 저장
          content: item.content,
          assignee: item.assignee,
          isChecked: false,
          completed: false
        }]
      });
    } catch (err) {
      console.error('Error adding checklist item:', err);
      alert(`체크리스트 항목 추가 중 오류가 발생했습니다: ${err.message}`);
    }
  };

  const handleUpdateCategory = async (categoryId, newCategoryContent) => {
    try {
      // 카테고리를 찾아서 존재하는지 확인
      const categoryToUpdate = categories.find(cat => cat.id === categoryId);
      
      if (!categoryToUpdate) {
        throw new Error('수정할 카테고리를 찾을 수 없습니다.');
      }
      
      // 올바른 API 경로 사용
      const updateUrl = `http://localhost:8999/api/fish/check/category/${roomCode}/${url}`;
      console.log("카테고리 수정 요청 URL:", updateUrl);
      console.log("카테고리 수정 요청 본문:", JSON.stringify({
        categoryId: categoryId,
        content: newCategoryContent
      }));
      
      // API를 통해 카테고리 업데이트 요청
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: categoryId,
          content: newCategoryContent
        })
      });
      
      console.log("응답 상태:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("응답 에러:", errorText);
        throw new Error(`카테고리 수정에 실패했습니다. 상태 코드: ${response.status}`);
      }
      
      // 로컬 상태 업데이트
      setCategories(categories.map(cat => 
        cat.id === categoryId ? {
          ...cat,
          name: newCategoryContent,
          content: newCategoryContent,
          category: newCategoryContent
        } : cat
      ));
      
      console.log('카테고리가 성공적으로 수정되었습니다.');
    } catch (err) {
      console.error('Error updating category:', err);
      alert(`카테고리 수정 중 오류가 발생했습니다: ${err.message}`);
    }
  };
  
  const handleDeleteCategory = async (categoryId) => {
    try {
      // 카테고리를 찾아서 존재하는지 확인
      const categoryToDelete = categories.find(cat => cat.id === categoryId);
      
      if (!categoryToDelete) {
        throw new Error('삭제할 카테고리를 찾을 수 없습니다.');
      }
      
    
      
      // 올바른 API 경로 사용
      const deleteUrl = `http://localhost:8999/api/fish/check/category/${roomCode}/${url}/${categoryId}`;
      console.log("카테고리 삭제 요청 URL:", deleteUrl);
      
      // API를 통해 카테고리 삭제 요청
      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });
      
      console.log("응답 상태:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("응답 에러:", errorText);
        throw new Error(`카테고리 삭제에 실패했습니다. 상태 코드: ${response.status}`);
      }
      
      // 로컬 상태 업데이트
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      
      // 체크리스트 아이템도 함께 삭제
      const updatedChecklistItems = { ...checklistItems };
      delete updatedChecklistItems[categoryId];
      setChecklistItems(updatedChecklistItems);
      
      // 현재 선택된 카테고리가 삭제되는 경우, 다른 카테고리 선택
      if (selectedCategoryId === categoryId) {
        if (updatedCategories.length > 0) {
          setSelectedCategoryId(updatedCategories[0].id);
        } else {
          setSelectedCategoryId(null);
        }
      }
      
      console.log('카테고리가 성공적으로 삭제되었습니다.');
    } catch (err) {
      console.error('Error deleting category:', err);
      alert(`카테고리 삭제 중 오류가 발생했습니다: ${err.message}`);
    }
  };
  const handleDeleteItem = async (categoryId, itemId) => {
    try {
      // 선택된 카테고리의 체크리스트 아이템 목록에서 삭제할 항목의 checkListItemId 찾기
      const itemToDelete = checklistItems[categoryId].find(item => item.id === itemId);
      
      if (!itemToDelete) {
        throw new Error('삭제할 체크리스트 항목을 찾을 수 없습니다.');
      }
      
      // 실제 API에서 사용하는 checkListItemId 가져오기
      const checkListItemId = itemToDelete.checkListItemId || itemId;
      
      // 올바른 API 경로 사용
      const deleteUrl = `http://localhost:8999/api/fish/check/${roomCode}/${url}/${checkListItemId}`;
      console.log("체크리스트 아이템 삭제 요청 URL:", deleteUrl);
      
      // API를 통해 체크리스트 아이템 삭제 요청
      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });
      
      console.log("응답 상태:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("응답 에러:", errorText);
        throw new Error(`체크리스트 항목 삭제에 실패했습니다. 상태 코드: ${response.status}`);
      }
      
      // 로컬 상태 업데이트
      setChecklistItems({
        ...checklistItems,
        [categoryId]: checklistItems[categoryId].filter(item => item.id !== itemId),
      });
      
      console.log('체크리스트 항목이 성공적으로 삭제되었습니다.');
    } catch (err) {
      console.error('Error deleting checklist item:', err);
      alert(`체크리스트 항목 삭제 중 오류가 발생했습니다: ${err.message}`);
    }
  };

  const handleUpdateItem = async (categoryId, itemId, updatedItem) => {
    try {
      // 선택된 카테고리의 체크리스트 아이템 목록에서 수정할 항목의 checkListItemId 찾기
      const itemToUpdate = checklistItems[categoryId].find(item => item.id === itemId);
      
      if (!itemToUpdate) {
        throw new Error('수정할 체크리스트 항목을 찾을 수 없습니다.');
      }
      
      // 실제 API에서 사용하는 checkListItemId 가져오기
      const checkListItemId = itemToUpdate.checkListItemId || itemId;
      
      // 올바른 API 경로 사용
      const updateUrl = `http://localhost:8999/api/fish/check/${roomCode}/${url}`;
      console.log("체크리스트 아이템 수정 요청 URL:", updateUrl);
      
      // 현재 isChecked 상태 유지
      const requestBody = {
        checkListItemId: checkListItemId,
        assignee: updatedItem.assignee,
        content: updatedItem.content,
        isChecked: itemToUpdate.isChecked || false
      };
      
      console.log("체크리스트 아이템 수정 요청 본문:", JSON.stringify(requestBody));
      
      // API를 통해 체크리스트 아이템 업데이트 요청
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log("응답 상태:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("응답 에러:", errorText);
        throw new Error(`체크리스트 항목 수정에 실패했습니다. 상태 코드: ${response.status}`);
      }
      
      // 로컬 상태 업데이트
      setChecklistItems({
        ...checklistItems,
        [categoryId]: checklistItems[categoryId].map(item =>
          item.id === itemId ? { 
            ...item, 
            ...updatedItem,
            checkListItemId: checkListItemId, // checkListItemId 유지
            isChecked: item.isChecked, // 현재 isChecked 상태 유지
            completed: item.isChecked // completed 값도 isChecked와 동기화
          } : item
        ),
      });
      
      console.log('체크리스트 항목이 성공적으로 수정되었습니다.');
    } catch (err) {
      console.error('Error updating checklist item:', err);
      alert(`체크리스트 항목 수정 중 오류가 발생했습니다: ${err.message}`);
    }
  };
  
  const handleToggleComplete = async (categoryId, itemId) => {
    try {
      // 선택된 카테고리의 체크리스트 아이템 목록에서 해당 항목 찾기
      const currentItem = checklistItems[categoryId].find(item => item.id === itemId);
      
      if (!currentItem) {
        throw new Error('체크리스트 항목을 찾을 수 없습니다.');
      }
      
      // 실제 API에서 사용하는 checkListItemId 가져오기
      const checkListItemId = currentItem.checkListItemId || itemId;
      
      // 완료 상태 토글
      const newCheckedStatus = !currentItem.isChecked;
      
      // 올바른 API 경로 사용 (체크리스트 수정과 같은 경로 사용)
      const updateUrl = `http://localhost:8999/api/fish/check/${roomCode}/${url}`;
      
      const requestBody = {
        checkListItemId: checkListItemId,
        assignee: currentItem.assignee,
        content: currentItem.content,
        isChecked: newCheckedStatus
      };
      
      console.log("체크리스트 완료 상태 변경 요청 URL:", updateUrl);
      console.log("체크리스트 완료 상태 변경 요청 본문:", JSON.stringify(requestBody));
      
      // API를 통해 체크리스트 아이템 완료 상태 업데이트 요청
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log("응답 상태:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("응답 에러:", errorText);
        throw new Error(`체크리스트 항목 완료 상태 변경에 실패했습니다. 상태 코드: ${response.status}`);
      }
      
      // 로컬 상태 업데이트
      setChecklistItems({
        ...checklistItems,
        [categoryId]: checklistItems[categoryId].map(item =>
          item.id === itemId ? { 
            ...item, 
            isChecked: newCheckedStatus,
            completed: newCheckedStatus // UI 호환성을 위해 completed 필드도 업데이트
          } : item
        )
      });
      
      console.log('체크리스트 항목 완료 상태가 성공적으로 변경되었습니다.');
    } catch (err) {
      console.error('Error toggling checklist item completion:', err);
      alert(`체크리스트 항목 완료 상태 변경 중 오류가 발생했습니다: ${err.message}`);
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
  onUpdateCategory={handleUpdateCategory}
  onDeleteCategory={handleDeleteCategory}
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