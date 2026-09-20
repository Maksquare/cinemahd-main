'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  migrateLocalToSupabase,
  fetchSupabaseWatchlist,
  fetchSupabaseWatchProgress,
  fetchSupabaseWatched,
} from '@/lib/supabase/user-store';

interface AuthContextType extends AuthState {
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    name: string,
    email: string,
    pass: string
  ) => Promise<{ success: boolean; error?: string; requiresConfirmation?: boolean }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  resendEmailOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  guestLogin: () => void;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isCloudConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'cinemahd_auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isCloudConnected = isSupabaseConfigured();

  // Initialize Auth & Supabase Session Listener
  useEffect(() => {
    const supabase = getSupabase();

    if (supabase && isCloudConnected) {
      // 1. Get initial session from Supabase
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (!error && session?.user) {
          const supaUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            plan: 'pro',
            createdAt: new Date(session.user.created_at).getTime(),
          };
          setUser(supaUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(supaUser));
        } else {
          checkLocalSession();
        }
        setIsLoading(false);
      });

      // 2. Subscribe to auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const supaUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            plan: 'pro',
            createdAt: new Date(session.user.created_at).getTime(),
          };
          setUser(supaUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(supaUser));

          // Sync user's private data from Supabase to local cache
          try {
            const [remoteWatchlist, remoteProgress, remoteWatched] = await Promise.all([
              fetchSupabaseWatchlist(session.user.id),
              fetchSupabaseWatchProgress(session.user.id),
              fetchSupabaseWatched(session.user.id),
            ]);

            if (remoteWatchlist.length > 0) {
              localStorage.setItem('cinemahd_watchlist', JSON.stringify(remoteWatchlist));
            }
            if (remoteProgress.length > 0) {
              localStorage.setItem('cinemahd_continue_watching', JSON.stringify(remoteProgress));
            }
            if (remoteWatched.length > 0) {
              localStorage.setItem('cinemahd_watched', JSON.stringify(remoteWatched));
            }
            window.dispatchEvent(new Event('cinemahd_storage_change'));
          } catch (e) {
            console.error('Error syncing Supabase user library:', e);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
          // Clear cached private data on logout
          localStorage.removeItem('cinemahd_watchlist');
          localStorage.removeItem('cinemahd_continue_watching');
          localStorage.removeItem('cinemahd_watched');
          window.dispatchEvent(new Event('cinemahd_storage_change'));
        }
        window.dispatchEvent(new Event('cinemahd_auth_change'));
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      checkLocalSession();
      setIsLoading(false);
    }
  }, [isCloudConnected]);

  const checkLocalSession = () => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user from localStorage:', e);
    }
  };

  const handlePostLoginSync = async (userId: string) => {
    try {
      const localWatchlist = JSON.parse(localStorage.getItem('cinemahd_watchlist') || '[]');
      const localProgress = JSON.parse(localStorage.getItem('cinemahd_continue_watching') || '[]');
      const localWatched = JSON.parse(localStorage.getItem('cinemahd_watched') || '[]');

      if (isCloudConnected && (localWatchlist.length > 0 || localProgress.length > 0)) {
        await migrateLocalToSupabase(userId, localWatchlist, localProgress, localWatched);
      }

      if (isCloudConnected) {
        const [cloudWatchlist, cloudProgress, cloudWatched] = await Promise.all([
          fetchSupabaseWatchlist(userId),
          fetchSupabaseWatchProgress(userId),
          fetchSupabaseWatched(userId),
        ]);

        localStorage.setItem('cinemahd_watchlist', JSON.stringify(cloudWatchlist));
        localStorage.setItem('cinemahd_continue_watching', JSON.stringify(cloudProgress));
        localStorage.setItem('cinemahd_watched', JSON.stringify(cloudWatched));
      }

      window.dispatchEvent(new Event('cinemahd_storage_change'));
    } catch (err) {
      console.error('Failed to sync post-login data:', err);
    }
  };

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !pass) {
      return { success: false, error: 'Email and password are required.' };
    }

    const supabase = getSupabase();

    if (supabase && isCloudConnected) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: pass,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const loggedUser: User = {
            id: data.user.id,
            name: data.user.user_metadata?.name || trimmedEmail.split('@')[0],
            email: data.user.email || trimmedEmail,
            plan: 'pro',
            createdAt: new Date(data.user.created_at).getTime(),
          };

          setUser(loggedUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
          await handlePostLoginSync(loggedUser.id);
          setIsAuthModalOpen(false);
          window.dispatchEvent(new Event('cinemahd_auth_change'));
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Authentication failed' };
      }
    }

    // Local / Demo fallback
    const extractedName = trimmedEmail.split('@')[0];
    const loggedUser: User = {
      id: `usr_${Date.now()}`,
      name: extractedName.charAt(0).toUpperCase() + extractedName.slice(1),
      email: trimmedEmail,
      plan: 'pro',
      createdAt: Date.now(),
    };

    setUser(loggedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    setIsAuthModalOpen(false);
    window.dispatchEvent(new Event('cinemahd_auth_change'));
    return { success: true };
  };

  const signUp = async (
    name: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; requiresConfirmation?: boolean }> => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !pass) {
      return { success: false, error: 'All fields are required.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const supabase = getSupabase();

    // Cache pending name in localStorage for OTP confirmation callback
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinemahd_pending_signup_name', trimmedName);
    }

    if (supabase && isCloudConnected) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: pass,
          options: {
            data: {
              name: trimmedName,
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          // If session is null, email confirmation is active in Supabase!
          if (data.session === null) {
            return {
              success: true,
              requiresConfirmation: true,
            };
          }

          const newUser: User = {
            id: data.user.id,
            name: trimmedName,
            email: trimmedEmail,
            plan: 'pro',
            createdAt: Date.now(),
          };

          setUser(newUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
          await handlePostLoginSync(newUser.id);
          window.dispatchEvent(new Event('cinemahd_auth_change'));
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' };
      }
    }

    // In demo / fallback mode, also prompt the 6-digit confirmation screen for testing
    return {
      success: true,
      requiresConfirmation: true,
    };
  };

  const verifyEmailOtp = async (
    email: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim();
    const cleanToken = token.trim().replace(/\D/g, '');

    if (!trimmedEmail || cleanToken.length !== 6) {
      return { success: false, error: 'Please enter the complete 6-digit verification code.' };
    }

    const supabase = getSupabase();

    if (supabase && isCloudConnected) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: trimmedEmail,
          token: cleanToken,
          type: 'signup',
        });

        if (error) {
          // Fallback to 'email' type if project configured with magic link / email otp
          const retry = await supabase.auth.verifyOtp({
            email: trimmedEmail,
            token: cleanToken,
            type: 'email',
          });

          if (retry.error) {
            return { success: false, error: retry.error.message || 'Invalid or expired code. Please try again.' };
          }

          if (retry.data.user) {
            const pendingName =
              localStorage.getItem('cinemahd_pending_signup_name') ||
              retry.data.user.user_metadata?.name ||
              trimmedEmail.split('@')[0];

            const confirmedUser: User = {
              id: retry.data.user.id,
              name: pendingName,
              email: retry.data.user.email || trimmedEmail,
              plan: 'pro',
              createdAt: new Date(retry.data.user.created_at).getTime(),
            };

            setUser(confirmedUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(confirmedUser));
            localStorage.removeItem('cinemahd_pending_signup_name');
            await handlePostLoginSync(confirmedUser.id);
            window.dispatchEvent(new Event('cinemahd_auth_change'));
            return { success: true };
          }
        }

        if (data.user) {
          const pendingName =
            localStorage.getItem('cinemahd_pending_signup_name') ||
            data.user.user_metadata?.name ||
            trimmedEmail.split('@')[0];

          const confirmedUser: User = {
            id: data.user.id,
            name: pendingName,
            email: data.user.email || trimmedEmail,
            plan: 'pro',
            createdAt: new Date(data.user.created_at).getTime(),
          };

          setUser(confirmedUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(confirmedUser));
          localStorage.removeItem('cinemahd_pending_signup_name');
          await handlePostLoginSync(confirmedUser.id);
          window.dispatchEvent(new Event('cinemahd_auth_change'));
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Verification failed.' };
      }
    }

    // Demo / Offline fallback verification
    const pendingName =
      (typeof window !== 'undefined' && localStorage.getItem('cinemahd_pending_signup_name')) ||
      trimmedEmail.split('@')[0];

    const confirmedUser: User = {
      id: `usr_${Date.now()}`,
      name: pendingName,
      email: trimmedEmail,
      plan: 'pro',
      createdAt: Date.now(),
    };

    setUser(confirmedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(confirmedUser));
      localStorage.removeItem('cinemahd_pending_signup_name');
    }
    window.dispatchEvent(new Event('cinemahd_auth_change'));
    return { success: true };
  };

  const resendEmailOtp = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return { success: false, error: 'Email is required.' };

    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: trimmedEmail,
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to resend confirmation code.' };
      }
    }

    return { success: true };
  };

  const guestLogin = () => {
    const guestUser: User = {
      id: `guest_${Date.now().toString().slice(-4)}`,
      name: 'Cinema VIP Guest',
      email: 'guest@cinemahd.pro.et',
      plan: 'pro',
      createdAt: Date.now(),
    };

    setUser(guestUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(guestUser));
    setIsAuthModalOpen(false);
    window.dispatchEvent(new Event('cinemahd_auth_change'));
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out from Supabase:', err);
      }
    }

    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    // Isolate user data: wipe cached user library on signout
    localStorage.removeItem('cinemahd_watchlist');
    localStorage.removeItem('cinemahd_continue_watching');
    localStorage.removeItem('cinemahd_watched');
    window.dispatchEvent(new Event('cinemahd_storage_change'));
    window.dispatchEvent(new Event('cinemahd_auth_change'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        signIn,
        signUp,
        verifyEmailOtp,
        resendEmailOtp,
        guestLogin,
        signOut,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isCloudConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
