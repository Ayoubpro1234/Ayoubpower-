export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'admin' | 'user';
  school?: string;
  grade?: string;
  isRegional?: boolean; // Regional (جهوي) or Baccalaureate (باك)
  studyShift?: 'morning' | 'afternoon' | 'full'; // صباحي أو مسائي
  subjects?: string[];
  favoriteSubjects?: string[];
  struggles?: string; // What they suffer from
  studyTimes?: string[];
  diagnosis?: string;
  studyPlan?: string; // AI generated plan
  points: number;
  streak: number;
  lastActive: string;
  onboardingCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: any;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'study' | 'quiz' | 'social';
  grade?: string;
  isAI?: boolean;
  userId?: string; // If it's a personalized AI challenge
  likes?: string[]; // Array of user IDs who liked this challenge
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  completed: boolean;
  completedAt?: string;
  date: string;
}
