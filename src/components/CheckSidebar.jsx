const CheckSidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">카테고리</h2>
      <ul>
        {categories.map(category => (
          <li
            key={category.id}
            onClick={() => onSelectCategory(category.name)}
            className={`p-2 cursor-pointer rounded ${
              selectedCategory === category.name ? 'bg-blue-100' : ''
            }`}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CheckSidebar