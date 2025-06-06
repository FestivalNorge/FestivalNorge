import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFestivals } from '../../services/festivalService';
import { Festival } from '../../types';

interface SearchBarProps {
  onSearch?: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Søk etter festivaler, steder eller sjangere...',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Festival[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [allFestivals, setAllFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load all festivals on component mount
  useEffect(() => {
    const fetchFestivals = async () => {
      setIsLoading(true);
      try {
        const data = await getFestivals();
        setAllFestivals(data);
      } catch (error) {
        console.error('Error fetching festivals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    
    const filtered = allFestivals.filter(festival => {
      const searchInName = festival.name.toLowerCase().includes(lowercasedSearch);
      const searchInCity = festival.location.city.toLowerCase().includes(lowercasedSearch);
      const searchInGenres = festival.genres.some(genre => 
        genre.toLowerCase().includes(lowercasedSearch)
      );
      
      return searchInName || searchInCity || searchInGenres;
    });

    setSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
    setShowSuggestions(filtered.length > 0);
    setActiveSuggestion(0);
  }, [searchTerm, allFestivals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    
    // Only perform search if no suggestion is selected
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/festival?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = (festival: Festival, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchTerm(festival.name);
    setShowSuggestions(false);
    // Navigate directly to the festival page
    navigate(`/festival/${festival.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    // Handle arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
    
    // Handle arrow up
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : 0));
    }
    
    // Handle enter - navigate to the selected festival
    if (e.key === 'Enter' && showSuggestions && activeSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion], e as unknown as React.MouseEvent);
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim() !== '' && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="input pr-10 shadow-lg focus:ring-accent-500 focus:border-accent-500 w-full"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            autoComplete="off"
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

      {showSuggestions && suggestions.length > 0 && (
        <ul 
          id="search-suggestions"
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {suggestions.map((festival, index) => (
            <li
              key={festival.id}
              onClick={(e) => handleSuggestionClick(festival, e)}
              onMouseEnter={() => setActiveSuggestion(index)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === activeSuggestion ? 'bg-accent-50' : ''
              }`}
              role="option"
              aria-selected={index === activeSuggestion}
            >
              <div className="font-medium text-gray-900">{festival.name}</div>
              <div className="text-sm text-gray-500">
                {festival.location.city} • {festival.genres.slice(0, 2).join(', ')}
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {isLoading && searchTerm.trim() !== '' && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-2">
          <div className="text-gray-500 text-sm">Laster forslag...</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;