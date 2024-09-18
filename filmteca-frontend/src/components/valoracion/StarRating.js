import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating, onChange }) => {
    const [hovered, setHovered] = useState(null);

    const handleClick = (value) => {
        onChange(value);
    };

    const handleMouseEnter = (value) => {
        setHovered(value);
    };

    const handleMouseLeave = () => {
        setHovered(null);
    };

    const renderStars = () => {
        return Array.from({ length: 10 }, (_, index) => {
            const value = index + 1;
            return (
                <span
                    key={value}
                    className={`star ${value <= (hovered || rating) ? 'filled' : ''}`}
                    onClick={() => handleClick(value)}
                    onMouseEnter={() => handleMouseEnter(value)}
                    onMouseLeave={handleMouseLeave}
                >
                    ★
                </span>
            );
        });
    };

    return <div className="star-rating">{renderStars()}</div>;
};

export default StarRating;
