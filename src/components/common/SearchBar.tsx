import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFestivals } from '../../services/festivalService';
import { Festival } from '../../types';

interface SearchBarProps {
  onSearch?: (term: string) => void;
  onSuggestionSelect?: (festival: Festival) => void;
  placeholder?: string;
  className?: string;
  disableSuggestions?: boolean;
  value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onSuggestionSelect,
  placeholder = 'Søk etter festivaler, steder eller sjangere...',
  className = '',
  disableSuggestions = false,
  value = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<Festival[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1); // Start with -1 for no selection
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

    // Use capture phase to ensure we catch the event before other handlers
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  // Update internal searchTerm when value prop changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Filter suggestions based on search term
  useEffect(() => {
    if (disableSuggestions || searchTerm.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestion(-1);
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
    setActiveSuggestion(-1); // Reset active suggestion when search term changes
  }, [searchTerm, allFestivals, disableSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    
    // If a suggestion is selected, let the suggestion click handler handle it
    if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      const selectedFestival = suggestions[activeSuggestion];
      setSearchTerm(selectedFestival.name);
      if (onSuggestionSelect) {
        onSuggestionSelect(selectedFestival);
      } else {
        navigate(`/festival/${selectedFestival.id}`);
      }
    } else if (onSearch) {
      // If there's an onSearch handler, use it
      onSearch(searchTerm);
    } else {
      // Otherwise, navigate to FestivalsPage with the search term
      navigate(`/festivals?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = (festival: Festival, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation(); // Stop all event propagation
    
    // Update the search term and hide suggestions
    const newSearchTerm = festival.name;
    setSearchTerm(newSearchTerm);
    setShowSuggestions(false);
    
    // Call the onSuggestionSelect callback if provided
    if (onSuggestionSelect) {
      // Create a new object to ensure React detects the change
      const selectedFestival = { ...festival };
      onSuggestionSelect(selectedFestival);
    } else {
      navigate(`/festival/${festival.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0 || !showSuggestions) return;

    // Handle arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => {
        // If no suggestion is selected, select the first one
        if (prev === -1) return 0;
        // Otherwise move to next suggestion or stay at last
        return prev < suggestions.length - 1 ? prev + 1 : prev;
      });
    }
    
    // Handle arrow up
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => {
        // If at the first suggestion or none selected, move to no selection
        if (prev <= 0) return -1;
        // Otherwise move to previous suggestion
        return prev - 1;
      });
    }
    
    // Handle enter - select the suggestion
    if (e.key === 'Enter' && showSuggestions && activeSuggestion >= 0) {
      e.preventDefault();
      const selectedFestival = suggestions[activeSuggestion];
      setSearchTerm(selectedFestival.name);
      setShowSuggestions(false);
      
      if (onSuggestionSelect) {
        onSuggestionSelect(selectedFestival);
      } else {
        navigate(`/festival/${selectedFestival.id}`);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              if (!disableSuggestions) {
                setShowSuggestions(value.trim() !== '');
              }
            }}
            onFocus={() => {
              if (!disableSuggestions) {
                setShowSuggestions(searchTerm.trim() !== '');
                setActiveSuggestion(-1); // Reset selection when input is focused
              }
            }}
            onKeyDown={!disableSuggestions ? handleKeyDown : undefined}
            onClick={(e) => {
              if (disableSuggestions) return;
              e.stopPropagation();
              if (searchTerm.trim() !== '') {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            className="input pr-10 shadow-lg focus:ring-accent-500 focus:border-accent-500 w-full"
            aria-autocomplete={disableSuggestions ? 'none' : 'list'}
            aria-controls={disableSuggestions ? undefined : 'search-suggestions'}
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
              className={`px-4 py-3 text-left w-full hover:bg-gray-100 ${index === activeSuggestion ? 'bg-gray-100' : ''}`}
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