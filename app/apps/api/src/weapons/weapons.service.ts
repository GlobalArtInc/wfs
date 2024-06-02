import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getWeaponsDto } from './weapons.dto';
import { WeaponRepository } from '@app/dal/repositories/weapon';

@Injectable()
export class WeaponsService {
  constructor(private readonly weaponRepository: WeaponRepository) {}

  fetchParams(params: unknown[]) {
    const arr = [];
    for (const param of params) {
      // @ts-ignore
      const item = param['$'];
      if (item) {
        arr[item.name] =
          item.value.replace(/\s/g, '').length === 0 || isNaN(item.value) ? item.value : Number(item.value);
      }
    }
    return Object.assign({}, arr);
  }

  async getWeapons(dto: getWeaponsDto) {
    const { weapon_id, search, limit } = dto;
    if (!search && !weapon_id) {
      const weapons = await this.weaponRepository.getAll();
      const arr = [];
      for (const weapon of weapons) {
        const { id, category, nameRu, nameEn } = weapon;
        arr.push({
          id,
          category,
          locales: {
            ru: nameRu ?? id,
            en: nameEn ?? id,
          },
        });
      }
      return arr;
    }

    if (weapon_id) {
      const weapon = await this.weaponRepository.getOneBy({ id: weapon_id });
      if (!weapon) {
        throw new NotFoundException('weaponNotFound');
      }
      const { id, category, nameRu, nameEn } = weapon;
      const formattedId = weapon.id.replace(/_powerup|_name/, '');

      const response = await fetch(`https://api.wfstats.cf/weapons?weapon_id=${formattedId}`);
      const data = await response.json();
      const { shop, stats } = data;
      return {
        id,
        category,
        name_ru: nameRu,
        name_en: nameEn,
        shop,
        stats,
      };
    } else if (search) {
      const weapons = await this.weaponRepository
        .createQueryBuilder('weapons')
        .where('name_ru like :name', { name: `%${search}%` })
        .orWhere('name_en like :name', { name: `%${search}%` })
        .limit(limit ?? 100)
        .getMany();
      const arr = [];
      for (const weapon of weapons) {
        const { id, nameRu, nameEn } = weapon;
        arr.push({
          id,
          locales: {
            ru: nameRu ?? id,
            en: nameEn ?? id,
          },
        });
      }
      return arr;
    }
  }
}
