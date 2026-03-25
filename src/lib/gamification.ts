import { UserProfile } from '../types';

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const BADGES: BadgeDef[] = [
  { id: 'first_blood', name: 'البداية', description: 'أكملت أول تحدي لك!', icon: '🎯', color: 'bg-blue-100 text-blue-600' },
  { id: 'streak_3', name: 'شعلة البداية', description: 'حافظت على سلسلة 3 أيام', icon: '🔥', color: 'bg-orange-100 text-orange-600' },
  { id: 'streak_7', name: 'لا يمكن إيقافي', description: 'حافظت على سلسلة 7 أيام', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'points_500', name: 'طالب مجتهد', description: 'جمعت 500 نقطة', icon: '🌟', color: 'bg-purple-100 text-purple-600' },
  { id: 'points_1000', name: 'أسطورة الدراسة', description: 'جمعت 1000 نقطة', icon: '👑', color: 'bg-amber-100 text-amber-600' },
  { id: 'level_5', name: 'مستوى متقدم', description: 'وصلت للمستوى 5', icon: '🚀', color: 'bg-emerald-100 text-emerald-600' },
];

export const calculateLevel = (points: number): number => {
  return Math.floor(points / 200) + 1;
};

export const getNextLevelPoints = (currentLevel: number): number => {
  return currentLevel * 200;
};

export const checkNewBadges = (
  profile: UserProfile,
  newPoints: number,
  newStreak: number,
  totalChallengesCompleted: number
): string[] => {
  const currentBadges = profile.badges || [];
  const newBadges: string[] = [];

  const addBadge = (id: string) => {
    if (!currentBadges.includes(id) && !newBadges.includes(id)) {
      newBadges.push(id);
    }
  };

  if (totalChallengesCompleted >= 1) addBadge('first_blood');
  if (newStreak >= 3) addBadge('streak_3');
  if (newStreak >= 7) addBadge('streak_7');
  if (newPoints >= 500) addBadge('points_500');
  if (newPoints >= 1000) addBadge('points_1000');
  
  const newLevel = calculateLevel(newPoints);
  if (newLevel >= 5) addBadge('level_5');

  return newBadges;
};
