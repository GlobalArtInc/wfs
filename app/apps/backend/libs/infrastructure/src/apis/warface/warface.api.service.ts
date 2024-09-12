import { Injectable } from '@nestjs/common';
// import { InternalApi } from '../internal-api.abstract';

@Injectable()
export class WarfaceApiService {
  getApiUrl(server: string) {
    switch (server) {
      case 'ru':
        return 'https://api.warface.ru';
      case 'int':
        return 'https://api.wf.my.com';
    }
  }

  async getClan(server: string, name: string) {
    const apiUrl = this.getApiUrl(server);
    const response = await fetch(encodeURI(`${apiUrl}/clan/members?clan=${name}`));

    return response.json();
  }

  async getStats(server: string, name: string) {
    try {
      const apiUrl = this.getApiUrl(server);
      const response = await fetch(encodeURI(`${apiUrl}/user/stat?name=${name}`));
      const player = await response.json();
      return player;
    } catch (err) {
      return false;
    }
  }

  async getAchievements(server: string, name: string) {
    const apiUrl = this.getApiUrl(server);
    const response = await fetch(encodeURI(`${apiUrl}/user/achievements?name=${name}`));

    return response.json();
  }
}
