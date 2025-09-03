import { dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { ko } from 'date-fns/locale';

// Status map for Korean translation
export const statusMap = {
  approved: '승인',
  pending: '대기',
  rejected: '거절',
};

// Color map for event styling
export const statusColorMap = {
  approved: '#03a9f4',
  pending: '#ffc107',
  rejected: '#e53935',
};

// date-fns localizer setup
const locales = {
  'ko': ko,
};

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Big Calendar Korean messages
export const messages = {
  next: "다음",
  previous: "이전",
  today: "오늘",
  month: "월",
  week: "주",
  day: "일",
  agenda: "목록",
  date: "날짜",
  time: "시간",
  event: "이벤트",
  noEventsInRange: "이 기간에 이벤트가 없습니다.",
  showMore: total => `+${total} 더보기`
};

// Event prop getter function
export const eventPropGetter = (event) => ({
  style: {
    backgroundColor: statusColorMap[event.resource] || '#757575', // Default grey color
  },
});
