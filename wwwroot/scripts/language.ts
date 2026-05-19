import { get } from './access';

export interface LanguageItem {
  jp: string;
  en: string;
  cn?: string;
  zhtw?: string;
  kr?: string;
}

export interface Language {
  [key: string]: string;
}

const LanguageItems: { [key: string]: LanguageItem } = {
  'status.title': {
    jp: 'ステータス',
    en: 'Status',
    cn: '状态',
  },
  'status.enum.none': {
    jp: 'なし',
    en: 'None',
    cn: '无',
  },
  'status.enum.stream-file': {
    jp: 'ファイル',
    en: 'File',
  },
  'status.enum.stream-socket': {
    jp: 'ソケット',
    en: 'Socket',
  },
  'status.enum.upload': {
    jp: 'アップロード',
    en: 'Upload',
  },
  'stream.title': {
    jp: 'ストリーム',
    en: 'Stream',
  },
  'stream.file': {
    jp: 'ファイル',
    en: 'File',
  },
  'stream.socket': {
    jp: 'ソケット',
    en: 'Socket',
  },
  'log-file.title': {
    jp: 'ログファイル',
    en: 'Log File',
  },
  'action.title': {
    jp: 'アクション',
    en: 'Action',
  },
  'action.clear': {
    jp: 'クリア',
    en: 'Clear',
  },
  'action.stream-stop': {
    jp: '停止',
    en: 'Stop',
  },
  'setting.title': {
    jp: '設定',
    en: 'Setting',
  },
  'setting.edit': {
    jp: '編集',
    en: 'Edit',
  },
  'setting.reset': {
    jp: 'リセット',
    en: 'Reset',
  },
  'setting.reset.confirm': {
    jp: 'リセットしますか？',
    en: 'Are you sure you want to reset?',
  },
  'setting.reset.warning': {
    jp: '設定反映には Elin の再起動が必要です',
    en: 'Restarting Elin is required to apply the settings.',
  },
  //--------------------------------------------
  // ModMessageId
  'mod.message.id.unknown-error': {
    jp: '不明なエラー',
    en: 'Unknown Error',
  },
  'mod.message.id.title': {
    jp: 'タイトル画面',
    en: 'Title Screen',
  },
  'mod.message.id.start-game': {
    jp: 'ゲーム開始',
    en: 'Start Game',
  },
  'mod.message.id.exit': {
    jp: '終了',
    en: 'Exit',
  },
  'mod.message.id.stream-server-error': {
    jp: 'SSE サーバーエラー',
    en: 'SSE Server Error',
  },
  'mod.message.id.stream-client-error': {
    jp: 'SSE クライアントエラー',
    en: 'SSE Client Error',
  },
  'mod.message.id.stream-client-start': {
    jp: 'SSE クライアント開始',
    en: 'SSE Client Start',
  },
  'mod.message.id.stream-client-open': {
    jp: 'SSE クライアント接続',
    en: 'SSE Client Connect',
  },
  'mod.message.id.stream-client-stop': {
    jp: 'SSE クライアント停止',
    en: 'SSE Client Stop',
  },
  'mod.message.id.api-tail-file-not-found': {
    jp: 'API ファイルが見つかりません',
    en: 'API File Not Found',
  },
};
const FallbackLanguage = 'en';
const GameLanguages = new Set(['jp', 'en', 'cn', 'zhtw', 'kr']);
const NavigatorLanguages = new Map([
  ['ja', 'jp'],
  ['ja-JP', 'jp'],
  ['en', 'en'],
  ['en-US', 'en'],
  ['en-GB', 'en'],
  ['zh', 'cn'],
  ['zh-TW', 'zhtw'],
  ['zh-CN', 'cn'],
  ['zh-Hans', 'cn'],
  ['zh-Hant', 'zhtw'],
  ['ko', 'kr'],
  ['ko-KR', 'kr'],
]);

export function getLanguage(baseLanguage: string | undefined): Language {
  let lang = baseLanguage;
  if (!GameLanguages.has(lang ?? '')) {
    const navigatorLanguage = navigator.language;
    lang = NavigatorLanguages.get(navigatorLanguage) ?? FallbackLanguage;
  }
  document.documentElement.lang = lang ?? FallbackLanguage;

  const result: Language = {};

  for (const key of Object.keys(LanguageItems)) {
    const item = get(LanguageItems[key]);
    const primary = {
      jp: item.jp,
      en: item.en,
    };

    let target = item[lang as keyof LanguageItem];
    if (!target) {
      if (primary.en) {
        target = primary.en;
      } else {
        target = primary.jp;
      }
    }
    result[key] = target;
  }

  return result;
}

export function applyLanguage(element: HTMLElement, language: Language) {
  const lang = element.dataset.lang;
  if (lang) {
    const text = language[lang];
    if (text) {
      element.textContent = text;
    }
  }
}

export function applyLanguages(language: Language) {
  const elements = document.querySelectorAll<HTMLElement>('[data-lang]');
  for (const element of elements) {
    applyLanguage(element, language);
  }
}
