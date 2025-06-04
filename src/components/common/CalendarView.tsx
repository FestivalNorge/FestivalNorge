import React, { useState } from 'react';
import { format, addMonths, subMonths, getMonth, getYear, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Festival } from '../../types';
import { Link } from 'react-router-dom';

interface CalendarViewProps {
  festivals: Festival[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ festivals }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={prevMonth} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-primary-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={nextMonth} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day, index) => (
          <div 
            key={index} 
            className="py-2 text-center text-sm font-semibold text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = getDay(monthStart);
    const daysInMonth = getDaysInMonth(currentMonth);
    const month = getMonth(currentMonth);
    const year = getYear(currentMonth);
    
    const rows = [];
    let days = [];
    
    // Create blank cells for days not in month
    for (let i = 0; i < startDate; i++) {
      days.push(
        <div key={`empty-${i}`} className="border border-gray-100 h-28 min-h-[7rem] p-2 bg-gray-50"></div>
      );
    }
    
    // Create cells for days in month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      
      // Get festivals happening on this day
      const festivalMatches = festivals.filter(festival => {
        const startDate = new Date(festival.dates.start);
        const endDate = new Date(festival.dates.end);
        return date >= startDate && date <= endDate;
      });
      
      days.push(
        <div key={day} className="border border-gray-200 h-28 min-h-[7rem] p-2 overflow-hidden relative">
          <div className="absolute top-1 right-1 text-sm font-medium text-gray-500">
            {day}
          </div>
          <div className="mt-4 space-y-1 overflow-y-auto h-[calc(100%-1.5rem)]">
            {festivalMatches.map(festival => (
              <Link
                key={festival.id}
                to={`/festival/${festival.id}`}
                className="block bg-primary-100 text-primary-800 rounded px-2 py-1 text-xs hover:bg-primary-200 transition-colors truncate"
              >
                {festival.name}
              </Link>
            ))}
          </div>
        </div>
      );
      
      if ((startDate + day) % 7 === 0) {
        rows.push(
          <div key={day} className="grid grid-cols-7">
            {days}
          </div>
        );
        days = [];
      }
    }
    
    // Add remaining days
    if (days.length > 0) {
      while (days.length < 7) {
        days.push(
          <div key={`empty-end-${days.length}`} className="border border-gray-100 h-28 min-h-[7rem] p-2 bg-gray-50"></div>
        );
      }
      
      rows.push(
        <div key="last-row" className="grid grid-cols-7">
          {days}
        </div>
      );
    }
    
    return <div className="space-y-1">{rows}</div>;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CalendarView;