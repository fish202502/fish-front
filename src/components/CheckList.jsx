import { useState } from "react";
import styles from "./CheckList.module.scss";

const CheckList = ({ category, items, onAddItem, onToggleComplete, onDeleteItem, onUpdateItem }) => {
  const [newItem, setNewItem] = useState({ text: "", assignee: "" });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({ text: "", assignee: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.text.trim() && newItem.assignee.trim()) {
      onAddItem(category, {
        text: newItem.text.trim(),
        assignee: newItem.assignee.trim(),
      });
      setNewItem({ text: "", assignee: "" });
    }
  };

  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setEditedItem({ text: item.text, assignee: item.assignee });
  };

  const handleSaveEdit = (itemId) => {
    onUpdateItem(category, itemId, editedItem);
    setEditingItemId(null);
  };

  return (
    <div className={styles.checklistContainer}>
      <h2 className="text-2xl font-bold mb-4">{category} 체크리스트</h2>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input
          type="text"
          value={newItem.assignee}
          onChange={(e) =>
            setNewItem({ ...newItem, assignee: e.target.value })
          }
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
          disabled={!newItem.text.trim() || !newItem.assignee.trim()}
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
                checked={item.completed}
                onChange={() => onToggleComplete(category, item.id)}
              />
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
                    value={editedItem.text}
                    onChange={(e) => setEditedItem({ ...editedItem, text: e.target.value })}
                    className={styles.inputField}
                  />
                  <button onClick={() => handleSaveEdit(item.id)} className={styles.saveButton}>저장</button>
                </>
              ) : (
                <span>
                  담당: {item.assignee} | 할일: {item.text}
                  <button onClick={() => handleEditClick(item)} className={styles.editButton}>수정</button>
                  <button onClick={() => onDeleteItem(category, item.id)} className={styles.deleteButton}>삭제</button>
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckList;
