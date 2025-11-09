import React from 'react';

const PasswordModal = ({ passwordModal, setPasswordModal, closePasswordModal, confirmApproval, passwordRef }) => {
  if (!passwordModal.isOpen) return null;

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
      zIndex: 1001,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '500px',
        width: '90vw',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        <button
          onClick={closePasswordModal}
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
          Confirm Status Change - {passwordModal.application?.full_name}
        </h3>
        <p style={{
          margin: '0 0 20px 0',
          color: '#666',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          To change status to <strong>{passwordModal.newStatus}</strong>, please enter the password:
        </p>
        <input
          ref={passwordRef}
          type="password"
          value={passwordModal.password}
          onChange={(e) => setPasswordModal(prev => ({ ...prev, password: e.target.value }))}
          placeholder="Enter approval password..."
          style={{
            width: '100%',
            padding: '12px',
            border: passwordModal.error ? '2px solid #e74c3c' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#395a7f',
            fontFamily: 'Arial, sans-serif',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: '10px'
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              confirmApproval();
            }
          }}
        />
        {passwordModal.error && (
          <p style={{
            margin: '0 0 15px 0',
            color: '#e74c3c',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {passwordModal.error}
          </p>
        )}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            onClick={closePasswordModal}
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
            onClick={confirmApproval}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: passwordModal.newStatus === 'approved' ? '#27ae60' : 
                              passwordModal.newStatus === 'rejected' ? '#e74c3c' : '#395a7f',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif'
            }}
            onMouseOver={(e) => {
              const color = passwordModal.newStatus === 'approved' ? '#229954' : 
                           passwordModal.newStatus === 'rejected' ? '#c0392b' : '#2c4a66';
              e.target.style.backgroundColor = color;
            }}
            onMouseOut={(e) => {
              const color = passwordModal.newStatus === 'approved' ? '#27ae60' : 
                           passwordModal.newStatus === 'rejected' ? '#e74c3c' : '#395a7f';
              e.target.style.backgroundColor = color;
            }}
          >
            {passwordModal.newStatus === 'approved' ? 'Approve' : 
             passwordModal.newStatus === 'rejected' ? 'Reject' : 'Update'} Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
