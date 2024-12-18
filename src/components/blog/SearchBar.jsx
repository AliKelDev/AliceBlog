import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
// Removed useNavigate since we won't be using navigation

const SearchBar = ({ 
  onSearch, 
  initialQuery = '', 
  placeholder = 'Search articles...', 
  showButton = true,
  fullWidth = false,
  className = '' 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const handleSearch = async (searchQuery) => {
    setIsLoading(true);
    try {
      await onSearch(searchQuery);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      handleSearch(newQuery);
    }, 300);
  };

  const handleClear = () => {
    setQuery('');
    handleSearch('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // This prevents form submission
    // Removed navigation code
    // The search is already happening through handleChange's debounce
    return false; // Extra prevention of form submission
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative flex items-center gap-2 ${fullWidth ? 'w-full' : 'max-w-xl'} ${className}`}
    >
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg
                   text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-purple-500/50 focus:border-purple-500/50"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 
                     hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showButton && (
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Search'
          )}
        </button>
      )}
    </form>
  );
};

export default SearchBar;