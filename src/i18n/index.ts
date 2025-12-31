import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';
import jaJP from './locales/ja-JP.json';

export type Locale = 'zh-CN' | 'en-US' | 'ja-JP';

export const locales = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
};

export type TranslationKeys = typeof zhCN;

export default locales;
