import React from 'react';
import './LoadingSpinner.css';

/**
 * Reusable LoadingSpinner component
 *
 * @param {Object} props
 * @param {'small' | 'medium' | 'large'} props.size - Size of the spinner
 * @param {boolean} props.fullScreen - Whether to show as a full-screen overlay
 * @param {string} props.message - Optional message to display
 * @param {string} props.className - Additional custom classes
 */
const LoadingSpinner = ({
    size = 'medium',
    fullScreen = false,
    message = '',
    className = ''
}) => {
    const containerClasses = [
        'loading-spinner-container',
        `spinner-size-${size}`,
        fullScreen ? 'spinner-fullscreen' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <div className="spinner-overlay">
                <div className="spinner-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                {message && <p className="spinner-message">{message}</p>}
            </div>
        </div>
    );
};

export default LoadingSpinner;
