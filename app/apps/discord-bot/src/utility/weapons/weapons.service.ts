import {
  ComponentParam,
  Context,
  CurrentTranslate,
  SelectedStrings,
  StringSelect,
  StringSelectContext,
  TranslationFn,
} from '@globalart/nestcord';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InternalBotApiService } from '@app/infrastructure/apis/internal-api';
import { WeaponCategoryToEmojiEnum } from '@app/shared/enums/emojis.enums';
import { ActionRowBuilder, Colors, EmbedBuilder, InteractionReplyOptions, StringSelectMenuBuilder } from 'discord.js';
import { WeaponInfo, WeaponList } from '@app/infrastructure/apis/internal-api/internal-api.types';
import { WeaponRepository } from '@app/dal/repositories/weapon';
import { HelpersService } from '../../helpers/helpers.service';
import { DiscordHelpersService } from '../../helpers/discord-helpers.service';

@Injectable()
export class UtilityWeaponsService {
  constructor(
    private readonly internalBotApiService: InternalBotApiService,
    private readonly weaponRepository: WeaponRepository,
    private readonly discordHelpersService: DiscordHelpersService,
  ) {}

  @StringSelect('wfs/weapons/:userId')
  async executeSelectWeapon(
    @Context() [interaction]: StringSelectContext,
    @ComponentParam('userId') userId: string,
    @SelectedStrings() selected: string[],
    @CurrentTranslate() trans: TranslationFn,
  ) {
    if (interaction.user.id !== userId) {
      return interaction.reply(trans('app.errors.incorrect_user'));
    }
    const selectedWeapon = selected[0];
    const weapon = await this.weaponRepository.getOneBy({ id: selectedWeapon });
    if (!weapon) {
      return interaction.update({
        content: 'app.errors.weapon_not_found',
        components: [],
      });
    }
    const lang = { code: 'ru' };
    const embed = await this.discordHelpersService.buildEmbed({
      color: Colors.Blue,
    });
    if (lang.code === 'ru') {
      embed.setAuthor({ name: weapon.nameRu });
    } else {
      embed.setAuthor({ name: weapon.nameEn });
    }
    embed.setImage(`https://wf.cdn.gmru.net/static/wf.mail.ru/img/main/items/${selectedWeapon}_shop.png`);
    const weaponInfo = await this.internalBotApiService.send<WeaponInfo>('post', 'weapons', {
      weapon_id: selectedWeapon,
    });
    if (!weaponInfo || !weaponInfo?.stats) {
      return interaction.update({
        content: trans('app.errors.weapon_not_found'),
        components: [],
      });
    }
    const { params, multipliers } = weaponInfo.stats;
    const fields = [];

    if (weapon.category === 'kn') {
      fields.push({
        name: trans('app.weapons.fire.title'),
        value: trans('app.weapons.fire.kn', {
          first_damage: HelpersService.numeral(params.melee_damage),
          secondary_damage: HelpersService.numeral(params.secondary_melee_damage),
          first_range: HelpersService.numeral(params.melee_range),
          secondary_range: HelpersService.numeral(params.secondary_melee_range),
          first_radius: HelpersService.numeral(params.melee_radius),
          secondary_radius: HelpersService.numeral(params.secondary_melee_radius),
        }),
        inline: true,
      });
      fields.push({
        name: trans('app.weapons.fire.title'),
        value: trans('app.weapons.fire.kn', {
          first_damage: HelpersService.numeral(params.melee_damage),
          secondary_damage: HelpersService.numeral(params.secondary_melee_damage),
          first_range: HelpersService.numeral(params.melee_range),
          secondary_range: HelpersService.numeral(params.secondary_melee_range),
          first_radius: HelpersService.numeral(params.melee_radius),
          secondary_radius: HelpersService.numeral(params.secondary_melee_radius),
        }),
        inline: true,
      });
      fields.push({
        name: trans('app.weapons.fire.title'),
        value: trans('app.weapons.fire.kn', {
          first_damage: HelpersService.numeral(params.melee_damage),
          secondary_damage: HelpersService.numeral(params.secondary_melee_damage),
          first_range: HelpersService.numeral(params.melee_range),
          secondary_range: HelpersService.numeral(params.secondary_melee_range),
          first_radius: HelpersService.numeral(params.melee_radius),
          secondary_radius: HelpersService.numeral(params.secondary_melee_radius),
        }),
        inline: true,
      });
      fields.push({
        name: trans('app.weapons.other.title'),
        value: trans('app.weapons.other.kn', {
          duration_first: HelpersService.numeral(params.melee_duration),
          duration_second: HelpersService.numeral(params.secondary_melee_duration),
          melee_out_duration_first: HelpersService.numeral(params.melee_out_duration),
          melee_out_duration_second: HelpersService.numeral(params.secondary_melee_out_duration),
        }),
        inline: true,
      });
    } else {
      fields.push({
        name: trans('app.weapons.fire.title'),
        value: trans('app.weapons.fire.desc', {
          damage: HelpersService.numeral(params.damage),
          rpm: HelpersService.numeral(params.rpm),
          range: HelpersService.numeral(params.damage_drop_min_distance),
          damage_min: HelpersService.numeral(params.damage_min),
          damage_drop_per_meter: HelpersService.numeral(params.damage_drop_per_meter),
        }),
        inline: true,
      });

      fields.push({
        name: trans('app.weapons.other.title'),
        value: trans('app.weapons.other.desc', {
          clip: HelpersService.numeral(params.ammo_amount),
          extra_clip: HelpersService.numeral(params.extra_ammo),
          reloading: HelpersService.numeral(params.reload_duration),
          melee_damage: HelpersService.numeral(params.melee_damage),
        }),
        inline: true,
      });

      if (multipliers) {
        fields.push({
          name: trans('app.weapons.multipliers.title'),
          value: trans('app.weapons.multipliers.desc', {
            head: multipliers.head_damage_mult,
            body: multipliers.body_damage_mult,
            arms: multipliers.arms_damage_mult,
            legs: multipliers.legs_damage_mult,
          }),
          inline: true,
        });
      }
      embed.addFields(fields);
    }

    return interaction.update({
      content: null,
      embeds: [embed],
      components: [],
    });
  }

  public async renderSelectionMenu(
    userId: string,
    weaponName: string,
    trans: TranslationFn,
  ): Promise<InteractionReplyOptions> {
    const weapons = await this.internalBotApiService.send<WeaponList[]>('post', 'weapons', {
      search: weaponName,
      limit: 25,
    });
    if (!weapons.length) {
      throw new NotFoundException(trans('app.errors.weapons_not_found'));
    }
    const lang = { code: 'ru' };
    const options = weapons.length
      ? weapons.map((item) => ({
          emoji: this.getEmoji(item.id),
          value: item.id,
          label: lang.code === 'en' ? item.locales.en : lang.code === 'se' ? item.locales.en : item.locales.ru,
        }))
      : [];

    const component = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`wfs/weapons/${userId}`)
        .setPlaceholder(trans('app.interactions.weapons.select'))
        .addOptions(options),
    );
    return {
      content: trans('app.interactions.weapons.select'),
      components: [component],
    };
  }

  private getEmoji(id: string) {
    const category = id.replace(/\d.*/, '').toUpperCase() as keyof typeof WeaponCategoryToEmojiEnum;

    return WeaponCategoryToEmojiEnum[category] || WeaponCategoryToEmojiEnum.DEFAULT;
  }
}
