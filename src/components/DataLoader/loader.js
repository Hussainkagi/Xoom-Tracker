import styles from "./loader.module.css";

const DataLoader = ({ size = "default" }) => {
  // Dynamic class for size
  const loaderSizeClass = size === "sm" ? styles.sm : styles.default;

  return (
    <div className={`${styles.dot__spinner} ${loaderSizeClass}`}>
      <div className={styles.dot__spinner__dot}></div>
      <div className={styles.dot__spinner__dot}></div>
      <div className={styles.dot__spinner__dot}></div>
      <div className={styles.dot__spinner__dot}></div>
      <div className={styles.dot__spinner__dot}></div>
      <div className={styles.dot__spinner__dot}></div>
      <div className={styles.dot__spinner__dot}></div>
      <div className={styles.dot__spinner__dot}></div>
    </div>
  );
};

export default DataLoader;
