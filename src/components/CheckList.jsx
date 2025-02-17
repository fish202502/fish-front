import { useState } from "react";

const CheckList = ({ category, items, onAddItem, onToggleComplete }) => {
  const [newItem, setNewItem] = useState({ text: '', assignee: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.text.trim() && newItem.assignee.trim()) {
      onAddItem(category, {
        text: newItem.text.trim(),
        assignee: newItem.assignee.trim()
      });
      setNewItem({ text: '', assignee: '' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{category} 체크리스트</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <div className="flex gap-2">
        <input
            type="text"
            value={newItem.assignee}
            onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
            placeholder="담당자"
            className="p-2 border rounded w-32"
          />
          <input
            type="text"
            value={newItem.text}
            onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
            placeholder="새 할일 추가"
            className="p-2 border rounded flex-1"
          />
         
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded"
            disabled={!newItem.text.trim() || !newItem.assignee.trim()}
          >
            추가
          </button>
        </div>
      </form>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleComplete(category, item.id)}
                className="mr-2"
              />
              <span className={item.completed ? 'line-through' : ''}>
              담당:{item.assignee}  할일: {item.text}
              </span>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CheckList