const Loader = (type) => {
  return (
    <div className={`spinner-border text-${type}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Loader;
