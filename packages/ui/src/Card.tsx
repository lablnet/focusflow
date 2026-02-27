import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export const Card = ({ children, className = '', title }: CardProps) => {
    return (
        <div className={`bg-card text-card-foreground rounded-2xl p-6 border border-border shadow-sm transition-all duration-300 ${className}`}>
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
            {children}
        </div>
    );
};
