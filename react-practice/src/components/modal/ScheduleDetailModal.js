import React from 'react';
import './ScheduleDetailModal.css';

const statusMap = {
  approved: '승인',
  pending: '대기',
  rejected: '거절',
};

const ScheduleDetailModal = ({ isOpen, onClose, event, onApprove, onReject, onDelete, isAdmin, isCreator }) => {
  if (!isOpen || !event) {
    return null;
  }

  // --- DEBUGGING START ---
  console.log('[Debug] ScheduleDetailModal Props:', { 
    event,
    isAdmin,
    isCreator,
    isPending: event.resource === 'pending'
  });
  // --- DEBUGGING END ---

  const { title, resource, description } = event;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p><strong>상태:</strong> <span className={`status-${resource}`}>{statusMap[resource] || resource}</span></p>
        <div className="description">
          {description || '설명이 없습니다.'}
        </div>
        <div className="modal-actions">
          {isAdmin && resource === 'pending' && (
            <>
              <button onClick={onApprove} className="approve-button">승인</button>
              <button onClick={onReject} className="reject-button">거절</button>
            </>
          )}
          {(isAdmin || isCreator) && <button onClick={onDelete} className="delete-button">삭제</button>}
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;
