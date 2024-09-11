export type OnlineInfo = Record<
  'ru' | 'int',
  {
    pvp: number;
    pve: number;
    all: number;
    max24: number;
  }
>;

export type WeaponList = {
  id: string;
  locales: Record<string, string>;
};

export type WeaponInfo = {
  id: string;
  category: string;
  name_en: string;
  name_ru: string;
  shop: {
    mmo: Record<string, number>;
    ui: Record<string, number>;
  };
  stats: {
    multipliers: Record<string, number>;
    params: Record<string, number>;
  };
  fireparams: Record<string, number>;
};

export type ClanInfo = {
  server: string;
  state: {
    createdAt: string;
    updatedAt: string;
  };
  data: {
    id: string;
    name: string;
    members: {
      nickname: string;
      rank_id: string;
      clan_points: number;
      clan_role: 'MASTER' | 'OFFICER' | 'REGULAR';
    }[];
  };
};

export type PlayerInfo = {
  server: string;
  state: {
    type: string;
    updatedAt: string;
  };
  player: Record<string, any>;
  fullPlayer: any;
  achievements: {
    achievement_id: string;
    progress: string;
    completion_time: string;
  }[];
};

export type TopInfo = {
  mission: string;
  items: {
    player_id: string;
    rank_id: number;
    nickname: string;
    clan_name: string;
    won: string;
    lost: string;
  }[];
};
