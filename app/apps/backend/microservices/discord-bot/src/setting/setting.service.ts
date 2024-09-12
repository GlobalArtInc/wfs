import { SettingRepository } from '@app/dal/repositories/setting';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SettingService {
  constructor(private readonly settingRepository: SettingRepository) {}

  async getValueByKey(name: string): Promise<any> {
    const entity = await this.settingRepository.getOneById(name);
    if (!entity) {
      throw new NotFoundException();
    }

    return entity?.value;
  }
}
