const Loader = (type) => {
  return (
    <div
      className={`spinner-border text-${type}`}
      style={{ width: "20px", height: "20px" }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Loader;
