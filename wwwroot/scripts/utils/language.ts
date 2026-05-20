import type { ModMessageId } from '../types/csharp';
import type { ModeKind } from '../types/mode';

export interface LanguageItem {
  jp: string;
  en: string;
  cn?: string;
  zhtw?: string;
  kr?: string;
}

const LanguageItems = {
  'mode.title': {
    jp: 'モード',
    en: 'Mode',
    cn: '模式',
  },
  'mode.enum.none': {
    jp: 'なし',
    en: 'None',
    cn: '无',
  },
  'mode.enum.stream-file': {
    jp: 'ファイル',
    en: 'File',
  },
  'mode.enum.stream-socket': {
    jp: 'ソケット',
    en: 'Socket',
  },
  'mode.enum.upload': {
    jp: 'アップロード',
    en: 'Upload',
  },
  'stream.title': {
    jp: 'ストリーム',
    en: 'Stream',
  },
  'stream.socket': {
    jp: 'ソケット',
    en: 'Socket',
  },
  'stream.file': {
    jp: 'ファイル',
    en: 'File',
  },
  'stream.stop': {
    jp: '停止',
    en: 'Stop',
  },
  'log-file.title': {
    jp: 'ログファイル',
    en: 'Log File',
  },
  'log-file.upload': {
    jp: 'アップロード',
    en: 'Upload',
  },
  'action.title': {
    jp: 'アクション',
    en: 'Action',
  },
  'action.clear': {
    jp: 'クリア',
    en: 'Clear',
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
  'setting.reset.submit': {
    jp: 'リセット',
    en: 'Reset',
  },
  'setting.reset.cancel': {
    jp: 'キャンセル',
    en: 'Cancel',
  },
  'setting.apply.warning': {
    jp: '設定反映には Elin の再起動が必要です',
    en: 'Restarting Elin is required to apply the settings.',
  },
  'error-dialog.title': {
    jp: 'エラー',
    en: 'Error',
  },
  'error-dialog.close': {
    jp: '閉じる',
    en: 'Close',
  },
  //--------------------------------------------
  // 設定UI
  'setting.editor.title': {
    jp: '設定の編集',
    en: 'Edit Setting',
  },
  'setting.editor.save': {
    jp: '保存',
    en: 'Save',
  },
  'setting.editor.cancel': {
    jp: 'キャンセル',
    en: 'Cancel',
  },
  // logBuffer
  'setting.editor.logBuffer.title': {
    jp: 'ログバッファ',
    en: 'Log Buffer',
  },
  'setting.editor.logBuffer.capacity': {
    jp: 'ログバッファ容量',
    en: 'Log Buffer Capacity',
  },
  'setting.editor.logBuffer.logFlushLimit': {
    jp: 'ログフラッシュ制限',
    en: 'Log Flush Limit',
  },
  // logFile
  'setting.editor.logFile.title': {
    jp: 'ログファイル',
    en: 'Log File',
  },
  'setting.editor.logFile.isEnabled': {
    jp: 'ログファイル有効',
    en: 'Log File Enabled',
  },
  'setting.editor.logFile.filePath': {
    jp: 'ログファイルパス',
    en: 'Log File Path',
  },
  // socketServer
  'setting.editor.socketServer.title': {
    jp: 'ソケットサーバー',
    en: 'Socket Server',
  },
  'setting.editor.socketServer.isEnabled': {
    jp: 'ソケットサーバー有効',
    en: 'Socket Server Enabled',
  },
  'setting.editor.socketServer.port': {
    jp: 'ポート',
    en: 'Port',
  },
  'setting.editor.socketServer.capacity': {
    jp: '容量',
    en: 'Capacity',
  },
  // socketClient
  'setting.editor.socketClient.title': {
    jp: 'ソケットクライアント',
    en: 'Socket Client',
  },
  'setting.editor.socketClient.isEnabled': {
    jp: 'ソケットクライアント有効',
    en: 'Socket Client Enabled',
  },
  'setting.editor.socketClient.port': {
    jp: 'ポート',
    en: 'Port',
  },
  // webServer
  'setting.editor.webServer.title': {
    jp: 'Webサーバー',
    en: 'Web Server',
  },
  'setting.editor.webServer.isEnabled': {
    jp: 'Webサーバー有効',
    en: 'Web Server Enabled',
  },
  'setting.editor.webServer.port': {
    jp: 'ポート',
    en: 'Port',
  },
  'setting.editor.webServer.openBrowserOnStartup': {
    jp: '起動時にブラウザを開く',
    en: 'Open Browser on Startup',
  },
  // frontend
  'setting.editor.frontend.title': {
    jp: 'フロントエンド',
    en: 'Frontend',
  },
  'setting.editor.frontend.cssFontFamily': {
    jp: 'CSS フォントファミリー',
    en: 'CSS Font Family',
  },
  'setting.editor.frontend.cssFontSize': {
    jp: 'CSS フォントサイズ',
    en: 'CSS Font Size',
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
} as const satisfies { [key in string]: LanguageItem };

export type Language = {
  [key in keyof typeof LanguageItems]: string;
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
  const language = lang ?? FallbackLanguage;
  // バグってんなこれ
  // documentElement.lang と keyof LanguageItem は体系が違う
  // document.documentElement.lang = language;

  const result: Language = Object.fromEntries(
    Object.entries(LanguageItems).map(([key, item]) => {
      const primary = {
        jp: item.jp,
        en: item.en,
      };

      //@ts-expect-error
      let target: string | undefined = item[language as keyof LanguageItem];
      if (!target) {
        if (primary.en) {
          target = primary.en;
        } else {
          target = primary.jp;
        }
      }

      return [key, target];
    }),
  ) as Language; // ん～、わからん！

  return result;
}

type ModeTextId = keyof Pick<
  Language,
  | 'mode.enum.none'
  | 'mode.enum.stream-socket'
  | 'mode.enum.stream-file'
  | 'mode.enum.upload'
>;

type ModMessageIdTextId = keyof Pick<Language, ModMessageId>;

export function toTextId(mode: ModeKind): ModeTextId;
export function toTextId(mode: ModMessageId): ModMessageIdTextId;
export function toTextId(
  input: ModeKind | ModMessageId,
): ModeTextId | ModMessageIdTextId {
  switch (input) {
    // ModeKind
    case 'none':
      return 'mode.enum.none';
    case 'stream-file':
      return 'mode.enum.stream-file';
    case 'stream-socket':
      return 'mode.enum.stream-socket';
    case 'upload':
      return 'mode.enum.upload';

    // ModMessageIdTextId は同じ値となる
    default:
      return input;
  }
}
