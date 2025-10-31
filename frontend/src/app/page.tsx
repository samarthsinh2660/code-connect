"use client"
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import CodeConnect from './landing';
import AuthModal from '@/components/Auth/AuthDialog';

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Handle initial auth state - DON'T auto-open modal
  useEffect(() => {
    if (isLoaded) {
      setInitialLoadComplete(true);
      // Don't auto-show modal - let user browse landing page first
      // setShowAuthModal(!isSignedIn);
    }
  }, [isLoaded, isSignedIn]);

  // Check for backend JWT auth
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !isSignedIn) {
      // User is authenticated via backend JWT
      setShowAuthModal(false);
    }
  }, [isSignedIn]);

  // Keyboard shortcut for debug mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Press Ctrl+Shift+D to remove potential overlays
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        document.querySelectorAll('.fixed, .absolute').forEach((el) => {
          if (el.classList.contains('debug-remove')) {
            (el as HTMLElement).style.display = 'none';
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle modal close attempt
  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  // Function to open auth modal (will be passed to landing page)
  const handleOpenAuth = () => {
    setShowAuthModal(true);
  };

  // Show loading state before Clerk is loaded
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen bg-slate-900"></div>;
  }

  return (
    <>
      <CodeConnect onOpenAuth={handleOpenAuth} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseModal}
      />
    </>
  );
}