import "./loader.css";
const Loader = ({ children, style }) => {
  return (
    <div style={style} className="loader_wrapper">
      <div className="loader_box">
        <div className="loader_ring">
          <div className="loader_ring_inner" />
        </div>
        <span className="loader_text">{children}</span>
      </div>
    </div>
  );
};
export default Loader;