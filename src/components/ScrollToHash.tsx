import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      
      // Use an interval to wait for the element to appear (e.g. after API load)
      let attempts = 0;
      const interval = setInterval(() => {
        const element = document.getElementById(id);
        if (element) {
          clearInterval(interval);
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
        
        // Stop after 3 seconds (30 attempts)
        attempts++;
        if (attempts > 30) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [hash, pathname]); // Re-run when hash or path changes

  return null;
};

export default ScrollToHash;
