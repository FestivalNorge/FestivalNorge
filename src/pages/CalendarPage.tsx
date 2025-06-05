import React from 'react';
import { useFestival } from '../context/FestivalContext';
import CalendarView from '../components/common/CalendarView';

const CalendarPage: React.FC = () => {
  const { festivals } = useFestival();

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Festivalkalender</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse upcoming festivals by date. This calendar view helps you plan your festival schedule throughout the year.
          </p>
        </div>
        
        {/* Calendar Component */}
        <CalendarView festivals={festivals} />
      </div>
    </div>
  );
};

export default CalendarPage;