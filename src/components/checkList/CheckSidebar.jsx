import styles from './CheckSidebar.module.scss';

const CheckSidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="">
      <h2 className="">🚀카테고리</h2>
      <ul className={styles.categoryul}>
        {categories.map(category => (
          <li
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`${styles.categoryli} ${selectedCategory === category.id ? styles.selected : ''}`}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckSidebar;