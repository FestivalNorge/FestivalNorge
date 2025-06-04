import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search festivals by name, city, or genre...',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      // If no onSearch prop is provided, navigate to search page
      navigate(`/festivals?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="input pr-10 shadow-lg focus:ring-accent-500 focus:border-accent-500"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-accent-500 transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;