import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { authStore } from '../stores/AuthStore';
import { blogApi } from '../services/api';
import { localizer, messages, eventPropGetter } from './calendarUtils';

import ScheduleFormModal from './modal/ScheduleFormModal';
import ScheduleDetailModal from './modal/ScheduleDetailModal';
import './modal/ScheduleFormModal.css';
import './modal/ScheduleDetailModal.css';

const BigCalendar = observer(() => {
  const [events, setEvents] = useState([]);
  const [formModal, setFormModal] = useState({ isOpen: false, eventData: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, event: null });

  const fetchEvents = useCallback(async () => {
    try {
      const data = await blogApi.calendar.getSchedules();
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        allDay: event.is_allday,
        resource: event.status,
        userId: event.created_by, // Fix: Ensure correct field is used for creator check
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleUpdateStatus = useCallback(async (scheduleId, newStatus) => {
    try {
      await blogApi.calendar.updateScheduleStatus(scheduleId, newStatus);
      fetchEvents();
    } catch (error) {
      console.error('Failed to update schedule status:', error);
    }
  }, [fetchEvents]);

  const handleDeleteSchedule = useCallback(async (scheduleId) => {
    const originalEvents = events;
    
    setEvents(prevEvents => prevEvents.filter(e => e.id !== scheduleId));

    try {
      await blogApi.calendar.deleteSchedule(scheduleId);
      alert('일정이 삭제되었습니다.');
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      alert('일정 삭제에 실패했습니다. 변경 사항을 되돌립니다.');
      setEvents(originalEvents);
    }
  }, [events, fetchEvents]);

  const handleSaveSchedule = useCallback(async ({ title, description, start, end }) => {
    try {
      const newEventData = {
        title,
        description,
        start,
        end,
        is_allday: false,
      };
      await blogApi.calendar.addSchedule(newEventData);
      fetchEvents();
    } catch (error) {
      console.error('Failed to add schedule:', error);
      alert('일정 추가에 실패했습니다.');
    }
  }, [fetchEvents]);

  const handleSelectSlot = useCallback(({ start, end }) => {
    setFormModal({ isOpen: true, eventData: { start, end } });
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setDetailModal({ isOpen: true, event });
  }, []);

  const handleModalApprove = useCallback(async () => {
    await handleUpdateStatus(detailModal.event.id, 'approved');
    setDetailModal({ isOpen: false, event: null });
  }, [detailModal.event, handleUpdateStatus]);

  const handleModalReject = useCallback(async () => {
    await handleUpdateStatus(detailModal.event.id, 'rejected');
    setDetailModal({ isOpen: false, event: null });
  }, [detailModal.event, handleUpdateStatus]);

  const handleModalDelete = useCallback(async () => {
    const eventToDelete = detailModal.event;
    if (eventToDelete && window.confirm(`'${eventToDelete.title}' 일정을 삭제하시겠습니까?`)) {
      await handleDeleteSchedule(eventToDelete.id);
    }
    setDetailModal({ isOpen: false, event: null });
  }, [detailModal.event, handleDeleteSchedule]);

  return (
    <div>
      <h1>Schedule Calendar</h1>
      <div style={{ height: '900px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventPropGetter}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          formats={{
            monthHeaderFormat: 'yyyy.MM',
            weekdayFormat: 'EEE',
          }}
          messages={messages}
        />
      </div>

      <ScheduleFormModal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, eventData: null })}
        onSave={handleSaveSchedule}
        eventData={formModal.eventData}
      />

      {detailModal.event && (
        <>
          {console.log('[Debug] AuthStore Profile:', authStore.profile)}
          <ScheduleDetailModal
            isOpen={detailModal.isOpen}
            onClose={() => setDetailModal({ isOpen: false, event: null })}
            event={detailModal.event}
            onApprove={handleModalApprove}
            onReject={handleModalReject}
            onDelete={handleModalDelete}
            isAdmin={authStore.profile?.role === 'admin'}
            isCreator={detailModal.event.userId === authStore.user?.id}
          />
        </>
      )}
    </div>
  );
});

export default BigCalendar;
