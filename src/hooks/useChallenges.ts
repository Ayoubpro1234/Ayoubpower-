import { useState, useEffect } from 'react';
import { db, collection, query, where, onSnapshot, handleFirestoreError, OperationType, addDoc, serverTimestamp, doc, updateDoc, getDocs, increment, arrayUnion, arrayRemove, getDoc } from '../lib/firebase';
import { Challenge, UserChallenge, UserProfile } from '../types';
import { format } from 'date-fns';
import { generatePersonalizedChallenges } from '../services/geminiService';
import { useNotifications } from './useNotifications';
import { checkNewBadges, calculateLevel, BADGES } from '../lib/gamification';

export function useChallenges(userId: string | undefined) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { sendNotification } = useNotifications();

  useEffect(() => {
    if (!userId) return;

    const challengesRef = collection(db, 'challenges');
    const unsubscribeChallenges = onSnapshot(challengesRef, (snapshot) => {
      const challengesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
      // Filter: Show global challenges OR AI challenges specifically for this user
      const filtered = challengesData.filter(c => !c.isAI || c.userId === userId);
      setChallenges(filtered);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'challenges');
    });

    return () => unsubscribeChallenges();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setUserChallenges([]);
      setLoading(true);
      return;
    }

    setLoading(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const userChallengesRef = collection(db, 'userChallenges');
    const q = query(userChallengesRef, where('userId', '==', userId), where('date', '==', today));

    const unsubscribeUserChallenges = onSnapshot(q, (snapshot) => {
      const userChallengesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserChallenge));
      setUserChallenges(userChallengesData);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'userChallenges');
      setLoading(false);
    });

    return () => unsubscribeUserChallenges();
  }, [userId]);

  const completeChallenge = async (challengeId: string) => {
    if (!userId) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const userChallengesRef = collection(db, 'userChallenges');
    
    try {
      // Check if already exists
      const q = query(userChallengesRef, where('userId', '==', userId), where('challengeId', '==', challengeId), where('date', '==', today));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        const newUC: Omit<UserChallenge, 'id'> = {
          userId,
          challengeId,
          completed: true,
          completedAt: new Date().toISOString(),
          date: today
        };
        await addDoc(userChallengesRef, newUC);

        // Update user points and gamification
        const challenge = challenges.find(c => c.id === challengeId);
        if (challenge) {
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data() as UserProfile;
            const newPoints = (userData.points || 0) + challenge.points;
            const currentLevel = userData.level || 1;
            const newLevel = calculateLevel(newPoints);
            
            // For total challenges, we can count userChallenges length + 1
            const totalChallengesQuery = await getDocs(query(userChallengesRef, where('userId', '==', userId)));
            const totalChallengesCompleted = totalChallengesQuery.size;

            const newBadges = checkNewBadges(userData, newPoints, userData.streak || 0, totalChallengesCompleted);

            const updates: any = {
              points: newPoints,
              level: newLevel,
            };

            if (newBadges.length > 0) {
              updates.badges = arrayUnion(...newBadges);
            }

            await updateDoc(userRef, updates);
            
            sendNotification('إنجاز رائع! 🎉', {
              body: `لقد أكملت "${challenge.title}" وحصلت على ${challenge.points} نقطة!`,
              type: challenge.type === 'study' ? 'task' : 'challenge'
            });

            if (newLevel > currentLevel) {
              setTimeout(() => {
                sendNotification('مستوى جديد! 🚀', {
                  body: `تهانينا! لقد وصلت إلى المستوى ${newLevel}! استمر في التألق.`,
                  type: 'challenge'
                });
              }, 1500);
            }

            if (newBadges.length > 0) {
              setTimeout(() => {
                const badgeNames = newBadges.map(id => BADGES.find(b => b.id === id)?.name).join(' و ');
                sendNotification('شارة جديدة! 🏅', {
                  body: `لقد حصلت على شارة: ${badgeNames}!`,
                  type: 'challenge'
                });
              }, 3000);
            }
          }
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'userChallenges/users');
    }
  };

  const seedChallenges = async () => {
    const challengesRef = collection(db, 'challenges');
    try {
      const snapshot = await getDocs(challengesRef);
      
      if (snapshot.empty) {
        const initialChallenges: Omit<Challenge, 'id'>[] = [
          {
            title: 'مراجعة الفرنسية (جهوي)',
            description: 'قم بمراجعة رواية La Boîte à Merveilles لمدة 45 دقيقة.',
            points: 60,
            type: 'study',
            grade: 'السنة الأولى باك'
          },
          {
            title: 'التربية الإسلامية (جهوي)',
            description: 'حفظ سورة يوسف (الشطر الأول) مع فهم المعاني.',
            points: 50,
            type: 'study',
            grade: 'السنة الأولى باك'
          },
          {
            title: 'تحليل نص فلسفي (وطني)',
            description: 'تدرب على منهجية تحليل نص فلسفي في مجزوءة الوضع البشري.',
            points: 70,
            type: 'study',
            grade: 'السنة الثانية باك'
          },
          {
            title: 'تمارين الفيزياء (وطني)',
            description: 'حل مسألة شاملة في التحولات النووية.',
            points: 80,
            type: 'study',
            grade: 'السنة الثانية باك'
          },
          {
            title: 'علوم الحياة والأرض (وطني)',
            description: 'رسم تخطيطي لآلية عضلة القلب مع البيانات.',
            points: 60,
            type: 'study',
            grade: 'السنة الثانية باك'
          },
          {
            title: 'كويز الاجتماعيات',
            description: 'أجب على أسئلة حول القضية الفلسطينية.',
            points: 40,
            type: 'quiz',
            grade: 'السنة الأولى باك'
          },
          {
            title: 'مراجعة محاضرة (جامعي)',
            description: 'قم بمراجعة آخر محاضرة وتلخيص أهم النقاط.',
            points: 70,
            type: 'study',
            grade: 'طالب جامعي'
          },
          {
            title: 'تحدي المشاركة',
            description: 'شارك نصيحة دراسية في مجموعة التلغرام.',
            points: 20,
            type: 'social'
          }
        ];

        for (const c of initialChallenges) {
          await addDoc(challengesRef, c);
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'challenges');
    }
  };

  const generateAITasks = async (profile: UserProfile) => {
    if (!userId) return;
    setLoading(true);
    try {
      const newTasks = await generatePersonalizedChallenges(profile);
      const challengesRef = collection(db, 'challenges');
      for (const task of newTasks) {
        await addDoc(challengesRef, task);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'challenges');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (challengeId: string) => {
    if (!userId) return;
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const challengeRef = doc(db, 'challenges', challengeId);
    const hasLiked = challenge.likes?.includes(userId);

    try {
      await updateDoc(challengeRef, {
        likes: hasLiked ? arrayRemove(userId) : arrayUnion(userId)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'challenges');
    }
  };

  return { challenges, userChallenges, loading, completeChallenge, seedChallenges, generateAITasks, toggleLike };
}
