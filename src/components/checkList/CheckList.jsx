import { useState } from "react";
import styles from "./CheckList.module.scss";

const CheckList = ({ category, items, onAddItem, onToggleComplete, onDeleteItem, onUpdateItem }) => {
  const [newItem, setNewItem] = useState({ text: "", name: "" });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({ text: "", name: "" });
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.text.trim() && newItem.name.trim()) {
      onAddItem(category, {
        text: newItem.text.trim(),
        name: newItem.name.trim(),
      });
      setNewItem({ text: "", name: "" });
    }
  };
 
  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setEditedItem({ text: item.text, name: item.name });
  };
 
  const handleSaveEdit = (itemId) => {
    onUpdateItem(category, itemId, editedItem);
    setEditingItemId(null);
  };
 
  const renderContent = () => {
    if (!category) {
      return <div className={styles.emptyMessage}>카테고리를 추가해주세요!</div>;
    }
 
    return (
      <>
        <h2>{category} 체크리스트</h2>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="담당자"
            className={styles.inputField}
          />
          <input
            type="text"
            value={newItem.text}
            onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
            placeholder="새 할일 추가"
            className={styles.inputField}
          />
          <button
            type="submit"
            className={styles.addButton}
            disabled={!newItem.text.trim() || !newItem.name.trim()}
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
                  onChange={() => onToggleComplete(category, item.id)}
                />
                <label htmlFor={`checkbox-${item.id}`} className={styles.checkListLabel}></label>
            
                {editingItemId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editedItem.name}
                      onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                      className={styles.inputField}
                    />
                    <input
                      type="text"
                      value={editedItem.text}
                      onChange={(e) => setEditedItem({ ...editedItem, text: e.target.value })}
                      className={styles.inputField}
                    />
                    <button onClick={() => handleSaveEdit(item.id)} className={styles.modifyButton}>저장</button>
                  </>
                ) : (
                  <span>
                    담당: {item.name} | 할일: {item.text}
                    <button onClick={() => handleEditClick(item)} className={styles.editButton}>수정</button>
                    <button onClick={() => onDeleteItem(category, item.id)} className={styles.deleteButton}>삭제</button>
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