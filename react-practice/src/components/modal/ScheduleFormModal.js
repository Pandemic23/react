import React, { useState, useEffect } from 'react';
import './ScheduleFormModal.css';

// Helper to format Date object for datetime-local input
const toDatetimeLocal = (date) => {
  if (!date) return '';
  // Adjust for local timezone
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().slice(0, 16);
};

const ScheduleFormModal = ({ isOpen, onClose, onSave, eventData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  useEffect(() => {
    if (isOpen && eventData) {
      setTitle(eventData.title || '');
      setDescription(eventData.description || '');
      setStart(eventData.start);
      setEnd(eventData.end);
    }
  }, [isOpen, eventData]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave({ title, description, start, end });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>새 스케줄</h2>
        <label>제목</label>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>설명</label>
        <textarea
          placeholder="설명"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>시작 시간</label>
        <input
          type="datetime-local"
          value={toDatetimeLocal(start)}
          onChange={(e) => setStart(new Date(e.target.value))}
        />
        <label>종료 시간</label>
        <input
          type="datetime-local"
          value={toDatetimeLocal(end)}
          onChange={(e) => setEnd(new Date(e.target.value))}
        />
        <div className="modal-actions">
          <button onClick={handleSave}>저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFormModal;
