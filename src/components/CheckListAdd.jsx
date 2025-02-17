import { useState } from "react";

const CheckListAdd = ({ onAddCategory }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="새 카테고리 추가"
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="mt-2 w-full bg-blue-500 text-white p-2 rounded">
        추가
      </button>
    </form>
  );
};
export default CheckListAdd