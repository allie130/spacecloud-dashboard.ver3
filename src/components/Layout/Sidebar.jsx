import React from 'react';
import './Sidebar.css';

const menuItems = [
  { id: 'signup', label: '회원가입', icon: '👥' },
  { id: 'listing', label: '입점 프로세스', icon: '🏢' },
  { id: 'booking', label: '예약/결제', icon: '📅' },
  { id: 'space', label: '공간별 성과', icon: '📊' },
  { id: 'revenue', label: '매출', icon: '💰' },
];

const Sidebar = ({ activeMenu, onMenuChange }) => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Phase 1 지표</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => onMenuChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="nav-section">
          <div className="nav-section-title">Coming Soon</div>
          <div className="nav-item disabled">
            <span className="nav-icon">🔄</span>
            <span className="nav-label">Phase 2: 유저 흐름</span>
          </div>
          <div className="nav-item disabled">
            <span className="nav-icon">📈</span>
            <span className="nav-label">Phase 3: 전환율</span>
          </div>
          <div className="nav-item disabled">
            <span className="nav-icon">🔁</span>
            <span className="nav-label">Phase 4: 리텐션</span>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
