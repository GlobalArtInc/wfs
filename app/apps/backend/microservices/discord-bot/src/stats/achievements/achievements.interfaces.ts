export interface MissionAchievement {
  id: string;
  goal: number;
}

export interface PlayerAchievement {
  achievement_id: string;
  progress: string;
  completion_time: string;
}

export interface AchievementData {
  id: string;
  goal: number;
  img: string;
  achievements: MissionAchievement[];
}
