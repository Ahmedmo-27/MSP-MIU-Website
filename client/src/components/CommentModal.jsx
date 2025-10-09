import React from 'react';

const CommentModal = ({ commentModal, setCommentModal, closeCommentModal, saveComment, textareaRef }) => {
  if (!commentModal.isOpen) return null;

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
        maxWidth: '800px',
        width: '90vw',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        <button
          onClick={closeCommentModal}
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
          Interview Comment - {commentModal.application?.full_name}
        </h3>
        <textarea
          ref={textareaRef}
          value={commentModal.comment}
          onChange={(e) => setCommentModal(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Enter interview comment here..."
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#395a7f',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.5',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = '#395a7f'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          marginTop: '20px'
        }}>
          <button
            onClick={closeCommentModal}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e9ecef'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          >
            Cancel
          </button>
          <button
            onClick={saveComment}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#395a7f',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2c4a66'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#395a7f'}
          >
            Save Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
