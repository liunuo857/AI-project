import { useMemo } from 'react';
import { useAppSelector } from './redux';
import locales, { type Locale } from '../i18n';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKey = NestedKeyOf<typeof locales['zh-CN']>;

export const useTranslation = () => {
  const { settings } = useAppSelector((state) => state.user);
  const currentLocale = (settings.language || 'zh-CN') as Locale;

  const t = useMemo(() => {
    const translations = locales[currentLocale] || locales['zh-CN'];

    return (key: TranslationKey | string, params?: Record<string, string | number>): string => {
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }

      if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${key}`);
        return key;
      }

      // 替换参数
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match;
        });
      }

      return value;
    };
  }, [currentLocale]);

  return { t, locale: currentLocale };
};
