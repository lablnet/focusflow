import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 ${className}`}>
            {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
            {children}
        </div>
    );
};

export default Card;
