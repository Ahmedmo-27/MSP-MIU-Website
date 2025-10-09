import React from 'react';

const TextModal = ({ expandedText, closeExpandedText }) => {
  if (!expandedText.field) return null;

  const fieldTitle = expandedText.field === 'skills' ? 'Skills' : 'Why Join MSP?';
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        <button
          onClick={closeExpandedText}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>
        <h3 style={{
          margin: '0 0 20px 0',
          color: '#395a7f',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          {fieldTitle}
        </h3>
        <div style={{
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6',
          color: '#333',
          fontSize: '14px'
        }}>
          {expandedText.text}
        </div>
      </div>
    </div>
  );
};

export default TextModal;
