import { MISSIONS } from '@app/shared/constants';
import { MissionEnum } from '@app/shared/enums';
import { Injectable } from '@nestjs/common';
import * as nf from 'number-format.js';

@Injectable()
export class HelpersService {
  public static isInt(n: number) {
    return Number(n) === n && n % 1 === 0;
  }

  public static isFloat(n: number) {
    return Number(n) === n && n % 1 !== 0;
  }

  public static numeral(number: number): any {
    if (this.isInt(number)) {
      return number > 0 ? nf('# ###.', number) : '0';
    } else if (this.isFloat(number)) {
      return number;
    } else {
      return number > 0 ? nf('# ###.', number) : '0';
    }
  }

  public static secToHours(sec: number): number {
    sec = sec / 10;
    return Math.floor((sec / 3600) ^ 0);
  }

  public static filterMissions(values: MissionEnum[]) {
    return MISSIONS.filter(mission => !values.includes(mission.value));
  }
}
