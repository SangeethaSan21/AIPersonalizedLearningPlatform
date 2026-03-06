import { X } from "lucide-react";
import "./modal.css";

const Modal = ({ children, open = false, onClose }) => {
  return (
    <div className="modal_overlay" style={{ display: open ? "flex" : "none" }}>
      <div className="modal_card">
        <button className="modal_close" onClick={onClose}>
          <X size={18} strokeWidth={2} />
        </button>
        {children}
      </div>
    </div>
  );
};
export default Modal;