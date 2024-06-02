import { TRANSLATION_DECORATOR_KEY } from '../translation.di-tokens';

export const Translate = (regex: RegExp = null): PropertyDecorator => {
  return (target, key) => {
    Reflect.defineMetadata(TRANSLATION_DECORATOR_KEY, { regex }, target, key);
  };
};
