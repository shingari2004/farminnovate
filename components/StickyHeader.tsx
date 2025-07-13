'use client';
import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';

const StickyHeader = () => {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const atTop = useRef(true); // Track if we are at top

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If user is at the top again, mark that
      if (currentScrollY === 0) {
        atTop.current = true;
      }

      // User starts scrolling from top (0 -> >0)
      if (atTop.current && currentScrollY > 0) {
        atTop.current = false;

        // Hide header
        setShowHeader(false);

        // Re-show after a short delay
        setTimeout(() => {
          setShowHeader(true);
        }, 700);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`
        sticky top-0 left-0 w-full z-50 
        transition-all duration-700 ease-in-out
        ${showHeader ? 'translate-y-0' : '-translate-y-full'}
        bg-white 
      `}>
        <Header />
      </div>
  );
};

export default StickyHeader;
