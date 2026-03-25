import { useState, useEffect } from 'react';
import { auth, db, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, doc, getDoc, onSnapshot, setDoc, updateDoc, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useAuth() {
  const [user, authLoading, error] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [redirectLoading, setRedirectLoading] = useState(true);

  // Handle redirect result for mobile/PWA environments
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          await handleUserAuth(result.user);
        }
      } catch (err: any) {
        console.error('Redirect result error:', err);
        if (err.code === 'auth/unauthorized-domain') {
          alert('خطأ: النطاق (Domain) غير مصرح به. يرجى إضافة رابط Vercel إلى قائمة Authorized domains في إعدادات Firebase Authentication.');
        }
      } finally {
        setRedirectLoading(false);
      }
    };
    checkRedirect();
  }, []);

  useEffect(() => {
    if (authLoading || redirectLoading) return;

    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as UserProfile);
      } else {
        setProfile(null);
      }
      setProfileLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      setProfileLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, redirectLoading]);

  const handleUserAuth = async (authUser: any) => {
    const userDocRef = doc(db, 'users', authUser.uid);
    const snapshot = await getDoc(userDocRef);
    
    if (!snapshot.exists()) {
      const initialProfile: UserProfile = {
        uid: authUser.uid,
        displayName: authUser.displayName || 'Student',
        email: authUser.email || '',
        role: authUser.email === 'ayoubjgnygj@gmail.com' ? 'admin' : 'user',
        points: 0,
        streak: 0,
        lastActive: new Date().toISOString(),
        onboardingCompleted: false
      };
      await setDoc(userDocRef, initialProfile);
    } else {
      const data = snapshot.data() as UserProfile;
      const expectedRole = authUser.email === 'ayoubjgnygj@gmail.com' ? 'admin' : 'user';
      if (data.role !== expectedRole) {
        await updateDoc(userDocRef, { role: expectedRole });
      }
    }
  };

  const login = async () => {
    try {
      // Use popup for desktop, but fallback to redirect if needed or on mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        await handleUserAuth(result.user);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        alert('خطأ: النطاق (Domain) غير مصرح به. يرجى إضافة رابط Vercel إلى قائمة Authorized domains في إعدادات Firebase Authentication.');
      } else if (err.code === 'auth/popup-blocked') {
        // Fallback to redirect if popup is blocked
        await signInWithRedirect(auth, googleProvider);
      }
    }
  };

  const logout = () => signOut(auth);

  const completeOnboarding = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const newProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || 'Student',
      email: user.email || '',
      role: user.email === 'ayoubjgnygj@gmail.com' ? 'admin' : 'user',
      points: 0,
      streak: 0,
      lastActive: new Date().toISOString(),
      onboardingCompleted: true,
      ...data
    };
    try {
      await setDoc(userDocRef, newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
    }
  };

  return { 
    user, 
    profile, 
    loading: authLoading || profileLoading || redirectLoading, 
    error, 
    login, 
    logout, 
    completeOnboarding 
  };
}
