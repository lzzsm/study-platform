export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicProfile {
  id: number;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  stats: {
    completedTasks: number;
    bestStreak: number;
    completedGoals: number;
    activeHabits: number;
  };
}

export interface UserSearchResult {
  id: number;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}
