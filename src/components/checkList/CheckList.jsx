import { useState } from "react";
import styles from "./CheckList.module.scss";

const CheckList = ({ categoryId, categoryName, items, onAddItem, onToggleComplete, onDeleteItem, onUpdateItem, hasPermission }) => {
  const [newItem, setNewItem] = useState({ content: "", assignee: "" });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({ content: "", assignee: "" });
 
  const handleSubmit = (e) => {
    e.preventDefault();
    // 권한이 없으면 제출하지 않음
    if (!hasPermission) {
      return;
    }
    
    if (newItem.content.trim() && newItem.assignee.trim()) {
      onAddItem(categoryId, {
        content: newItem.content.trim(),
        assignee: newItem.assignee.trim(),
      });
      setNewItem({ content: "", assignee: "" });
    }
  };
 
  const handleEditClick = (item) => {
    // 권한이 없으면 수정 모드로 전환하지 않음
    if (!hasPermission) {
      return;
    }
    
    setEditingItemId(item.id);
    setEditedItem({ content: item.content, assignee: item.assignee });
  };
 
  const handleSaveEdit = (itemId) => {
    // 권한이 없으면 저장하지 않음
    if (!hasPermission) {
      return;
    }
    
    onUpdateItem(categoryId, itemId, editedItem);
    setEditingItemId(null);
  };
 
  const renderContent = () => {
    if (!categoryId) {
      return <div className={styles.emptyMessage}>카테고리를 추가해주세요!</div>;
    }
 
    return (
      <>
        <h2>{categoryName || categoryId} 체크리스트</h2>
        <form onSubmit={handleSubmit} className={`${styles.formContainer} ${!hasPermission ? styles.disabledForm : ''}`}>
          <input
            type="text"
            value={newItem.assignee}
            onChange={(e) => hasPermission && setNewItem({ ...newItem, assignee: e.target.value })}
            placeholder="담당자"
            className={styles.inputField}
            disabled={!hasPermission}
          />
          <input
            type="text"
            value={newItem.content}
            onChange={(e) => hasPermission && setNewItem({ ...newItem, content: e.target.value })}
            placeholder="새 할일 추가"
            className={styles.inputField}
            disabled={!hasPermission}
          />
          <button
            type="submit"
            className={`${styles.addButton} ${!hasPermission ? styles.disabledButton : ''}`}
            disabled={!hasPermission || !newItem.content.trim() || !newItem.assignee.trim()}
          >
            추가
          </button>
        </form>
        {!hasPermission && (
          <div className={styles.permissionMessage}>
            읽기 권한만 있어 체크리스트 항목을 추가할 수 없습니다.
          </div>
        )}
        <ul className={styles.listContainer}>
          {items.map((item) => (
            <li key={item.id} className={`${styles.listItem} ${item.completed ? styles.completed : ""}`}>
              <div>
                <input
                  type="checkbox"
                  id={`checkbox-${item.id}`}
                  className={styles.checkListCheckBox}
                  checked={item.completed}
                  onChange={() => onToggleComplete(categoryId, item.id)}
                />
                <label htmlFor={`checkbox-${item.id}`} className={styles.checkListLabel}></label>
            
                {editingItemId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editedItem.assignee}
                      onChange={(e) => setEditedItem({ ...editedItem, assignee: e.target.value })}
                      className={styles.inputField}
                      disabled={!hasPermission}
                    />
                    <input
                      type="text"
                      value={editedItem.content}
                      onChange={(e) => setEditedItem({ ...editedItem, content: e.target.value })}
                      className={styles.inputField}
                      disabled={!hasPermission}
                    />
                    <button 
                      onClick={() => handleSaveEdit(item.id)} 
                      className={`${styles.modifyButton} ${!hasPermission ? styles.disabledButton : ''}`}
                      disabled={!hasPermission}
                    >
                      저장
                    </button>
                  </>
                ) : (
                  <span>
                    담당: {item.assignee} | 할일: {item.content}
                    <button 
                      onClick={() => handleEditClick(item)} 
                      className={`${styles.editButton} ${!hasPermission ? styles.disabledButton : ''}`}
                      disabled={!hasPermission}
                    >
                      수정
                    </button>
                    <button 
                      onClick={() => hasPermission && onDeleteItem(categoryId, item.id)} 
                      className={`${styles.deleteButton} ${!hasPermission ? styles.disabledButton : ''}`}
                      disabled={!hasPermission}
                    >
                      삭제
                    </button>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  };
 
  return (
    <div className={`${styles.checklistContainer} ${!hasPermission ? styles.readOnly : ''}`}>
      {renderContent()}
    </div>
  );
 };
 
 export default CheckList;