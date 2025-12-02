import React from 'react';
import './Card.css';

const Card = ({ children, className = '', title, icon: Icon, action }) => {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="card-header">
          <div className="card-title-wrapper">
            {Icon && <Icon size={20} className="card-icon" />}
            {title && <h3 className="card-title">{title}</h3>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
