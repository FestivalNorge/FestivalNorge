import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFestival } from '../context/FestivalContext';
import FestivalCard from '../components/common/FestivalCard';

const MyFestivalsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { getFestivalById } = useFestival();
  
  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const savedFestivals = user?.savedFestivals.map(id => getFestivalById(id)).filter(Boolean) || [];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Festivals</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Your saved festivals and events all in one place. Manage your festival wishlist and stay organized.
          </p>
        </div>
        
        {/* Saved Festivals List */}
        {savedFestivals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedFestivals.map(festival => (
              <FestivalCard key={festival?.id} festival={festival!} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Saved Festivals Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't saved any festivals yet. Browse festivals and click the heart icon to save them to your collection.
            </p>
            <a href="/festivals" className="btn btn-primary">
              Explore Festivals
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFestivalsPage;