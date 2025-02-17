import styles from './CheckSidebar.module.scss';

const CheckSidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className={styles.leftContainer}>
      <h2 className="text-xl font-bold mb-4">카테고리</h2>
      <ul>
        {categories.map(category => (
          <li
            key={category.id}
            onClick={() => onSelectCategory(category.name)}
            className={`${selectedCategory === category.name ? styles.selected : ''}`}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckSidebar;
