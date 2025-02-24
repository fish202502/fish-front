import { useState } from "react";
import styles from "./CheckList.module.scss";

const CheckList = ({ categoryId, categoryName, items, onAddItem, onToggleComplete, onDeleteItem, onUpdateItem }) => {
  const [newItem, setNewItem] = useState({ content: "", assignee: "" });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({ content: "", assignee: "" });
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.content.trim() && newItem.assignee.trim()) {
      onAddItem(categoryId, {
        content: newItem.content.trim(),
        assignee: newItem.assignee.trim(),
      });
      setNewItem({ content: "", assignee: "" });
    }
  };
 
  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setEditedItem({ content: item.content, assignee: item.assignee });
  };
 
  const handleSaveEdit = (itemId) => {
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
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <input
            type="text"
            value={newItem.assignee}
            onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
            placeholder="담당자"
            className={styles.inputField}
          />
          <input
            type="text"
            value={newItem.content}
            onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
            placeholder="새 할일 추가"
            className={styles.inputField}
          />
          <button
            type="submit"
            className={styles.addButton}
            disabled={!newItem.content.trim() || !newItem.assignee.trim()}
          >
            추가
          </button>
        </form>
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
                    />
                    <input
                      type="text"
                      value={editedItem.content}
                      onChange={(e) => setEditedItem({ ...editedItem, content: e.target.value })}
                      className={styles.inputField}
                    />
                    <button onClick={() => handleSaveEdit(item.id)} className={styles.modifyButton}>저장</button>
                  </>
                ) : (
                  <span>
                    담당: {item.assignee} | 할일: {item.content}
                    <button onClick={() => handleEditClick(item)} className={styles.editButton}>수정</button>
                    <button onClick={() => onDeleteItem(categoryId, item.id)} className={styles.deleteButton}>삭제</button>
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
    <div className={styles.checklistContainer}>
      {renderContent()}
    </div>
  );
 };
 
 export default CheckList;