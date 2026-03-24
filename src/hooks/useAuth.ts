import { useState, useEffect } from 'react';
import { auth, db, googleProvider, signInWithPopup, signOut, doc, getDoc, onSnapshot, setDoc, updateDoc, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useAuth() {
  const [user, loading, error] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

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
  }, [user, loading]);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userDocRef);
      
      if (!snapshot.exists()) {
        // Create initial profile if it doesn't exist
        const initialProfile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || 'Student',
          email: user.email || '',
          role: user.email === 'ayoubjgnygj@gmail.com' ? 'admin' : 'user',
          points: 0,
          streak: 0,
          lastActive: new Date().toISOString(),
          onboardingCompleted: false
        };
        await setDoc(userDocRef, initialProfile);
      } else {
        const data = snapshot.data() as UserProfile;
        const expectedRole = user.email === 'ayoubjgnygj@gmail.com' ? 'admin' : 'user';
        if (data.role !== expectedRole) {
          await updateDoc(userDocRef, { role: expectedRole });
        }
      }
    } catch (err) {
      console.error('Login error:', err);
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

  return { user, profile, loading: loading || profileLoading, error, login, logout, completeOnboarding };
}
