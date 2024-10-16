import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchQuery = new URLSearchParams(location.search).get("query"); // Get search query from URL

  // Fetch search results from the backend based on the query
  useEffect(() => {
    // Frontend fetch request in SearchResults component
    const fetchSearchResults = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `http://localhost:4000/events/search?query=${searchQuery}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        const data = await response.json();
        setFilteredResults(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  if (loading) {
    return <p>Loading search results...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Search Results for "{searchQuery}"</h2>

      {filteredResults.length > 0 ? (
        <ul>
          {filteredResults.map((project, index) => (
            <li key={index}>
              <strong>{project.name}</strong> - {project.category}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found for "{searchQuery}".</p>
      )}
    </div>
  );
};

export default SearchResults;
