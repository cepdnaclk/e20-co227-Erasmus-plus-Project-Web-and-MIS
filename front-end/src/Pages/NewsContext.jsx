import React, { createContext, useState, useEffect, useContext } from 'react';
import {domainName} from "../DomainName"

// Create a context to manage news data
const NewsContext = createContext();

// Custom hook to consume the NewsContext in other components
export const useNews = () => useContext(NewsContext);

// NewsProvider component to fetch and provide news data to its children
export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);

  // useEffect hook to fetch news data on component mount
  useEffect(() => {
    const fetchNews = async () => {
      const start = performance.now();

      // Send GET request to fetch news from the backend API
      try {
        const response = await fetch(`${domainName}/api/v1/news`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate', // Ensures fresh response
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }

      const end = performance.now();
    };

    fetchNews(); // Fetch news on component mount
  }, []);

  return (
    <NewsContext.Provider value={news}>
      {children}
    </NewsContext.Provider>
  );
};
