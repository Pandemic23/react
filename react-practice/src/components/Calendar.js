import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';
import { blogApi } from '../services/api';

// Toast UI Calendar
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

// 캘린더 소유자 ID
const CALENDAR_OWNER_ID = '09cf163a-64a8-493f-a899-bf836edff027';

const calendars = [
    { id: 'approved', name: '승인됨', backgroundColor: '#03a9f4', borderColor: '#03a9f4' },
    { id: 'pending', name: '승인 대기', backgroundColor: '#ffc107', borderColor: '#ffc107' },
    { id: 'rejected', name: '거절됨', backgroundColor: '#e53935', borderColor: '#e53935' },
];

const formatEventForTUI = (event) => ({
  id: event.id.toString(),
  calendarId: event.status,
  title: event.title,
  category: event.is_allday ? 'allday' : 'time',
  start: event.start_time,
  end: event.end_time,
  isAllDay: event.is_allday,
  state: event.status,
});

const AdminApprovalUI = ({ pendingSchedules, onUpdate }) => {
    if (pendingSchedules.length === 0) {
        return <div>승인 대기 중인 스케줄이 없습니다.</div>;
    }

    return (
        <div className="admin-approval-ui">
            <h3>승인 대기 목록</h3>
            <ul>
                {pendingSchedules.map(schedule => (
                    <li key={schedule.id}>
                        <span>{schedule.title}</span>
                        <button onClick={() => onUpdate(schedule.id, 'approved')}>승인</button>
                        <button onClick={() => onUpdate(schedule.id, 'rejected')}>거절</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const TuiCalendar = observer(() => {
  const [events, setEvents] = useState([]);
  const [pendingSchedules, setPendingSchedules] = useState([]);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await blogApi.calendar.getSchedules();
      const formattedEvents = data.map(formatEventForTUI);
      setEvents(formattedEvents);
      
      if (authStore.user?.id === CALENDAR_OWNER_ID) {
        setPendingSchedules(data.filter(event => event.status === 'pending'));
      }

    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleBeforeCreateSchedule = useCallback(async (scheduleData) => {
    if (authStore.user?.id === CALENDAR_OWNER_ID) {
      alert('관리자는 스케줄을 생성할 수 없습니다.');
      return;
    }

    try {
      const newEventData = {
        title: scheduleData.title,
        start: scheduleData.start.toDate(),
        end: scheduleData.end.toDate(),
        isAllDay: scheduleData.isAllDay,
      };
      const newEvent = await blogApi.calendar.addSchedule(newEventData);
      setEvents(prevEvents => [...prevEvents, formatEventForTUI(newEvent)]);
    } catch (error) {
      console.error('Failed to add schedule:', error);
    }
  }, []);

  const handleUpdateStatus = async (scheduleId, newStatus) => {
    try {
        const updatedEvent = await blogApi.calendar.updateScheduleStatus(scheduleId, newStatus);
        
        setEvents(prevEvents => 
          prevEvents.map(e => e.id === updatedEvent.id.toString() ? formatEventForTUI(updatedEvent) : e)
        );

        setPendingSchedules(prev => prev.filter(s => s.id !== scheduleId));

      } catch (error) {
        console.error('Failed to update schedule status:', error);
      }
  };

  return (
    <div>
      <h1>Schedule Calendar</h1>
      {authStore.user?.id === CALENDAR_OWNER_ID && (
        <AdminApprovalUI pendingSchedules={pendingSchedules} onUpdate={handleUpdateStatus} />
      )}
      <Calendar
        height="900px"
        view="month"
        events={events}
        calendars={calendars}
        useCreationPopup={authStore.user?.id !== CALENDAR_OWNER_ID}
        useDetailPopup={true}
        onBeforeCreateSchedule={handleBeforeCreateSchedule}
      />
    </div>
  );
});

export default TuiCalendar;