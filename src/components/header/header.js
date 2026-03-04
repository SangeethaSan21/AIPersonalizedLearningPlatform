import { NavLink } from "react-router-dom";
import "./header.css";
import { Home, User } from "lucide-react";

const Header = () => {
  return (
    <header className="header">
      <NavLink to="/" className="header_logo">
        <div className="logo_icon">AI</div>
        <span className="logo_text">LearnAI</span>
      </NavLink>
      <div className="header_actions">
        <NavLink to="/" className="header_btn" title="Home">
          <Home size={20} strokeWidth={1.5} />
        </NavLink>
        <NavLink to="/profile" className="header_btn header_avatar" title="Profile">
          <User size={20} strokeWidth={1.5} />
        </NavLink>
      </div>
    </header>
  );
};

export default Header;