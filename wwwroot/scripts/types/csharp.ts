import z from 'zod';

export const MessageKindScheme = z.enum([
  'Mod',
  'NewLine',
  'Message',
  'Color',
  'MessageWithColor',
]);
export type MessageKind = z.infer<typeof MessageKindScheme>;

export const GameDateTimeScheme = z.object({
  year: z.number(),
  month: z.number(),
  day: z.number(),
  hour: z.number(),
  minute: z.number(),
  second: z.number(),
});
export type GameDateTime = z.infer<typeof GameDateTimeScheme>;

export const MessageColorScheme = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
  a: z.number(),
});
export type MessageColor = z.infer<typeof MessageColorScheme>;

export const ModMessageKindScheme = z.enum([
  'Notice',
  'Information',
  'Warning',
  'Error',
]);
export type ModMessageKind = z.infer<typeof ModMessageKindScheme>;

// ModMessageIdConverterTest.NoTest をデバッグ実行でもしてコピペする
export const ModMessageIdScheme = z.enum([
  'mod.message.id.unknown-error',
  'mod.message.id.title',
  'mod.message.id.start-game',
  'mod.message.id.exit',
  'mod.message.id.stream-server-error',
  'mod.message.id.stream-client-error',
  'mod.message.id.stream-client-start',
  'mod.message.id.stream-client-open',
  'mod.message.id.stream-client-stop',
  'mod.message.id.api-tail-file-not-found',
]);
export type ModMessageId = z.infer<typeof ModMessageIdScheme>;

export const ModMessageScheme = z.object({
  kind: ModMessageKindScheme,
  messageId: ModMessageIdScheme,
  details: z.any().optional(),
});
export type ModMessage = z.infer<typeof ModMessageScheme>;

export const MessageItemScheme = z.object({
  kind: MessageKindScheme,
  color: MessageColorScheme,
  message: z.string().nullable(),
  mod: ModMessageScheme.nullable(),
});
export type MessageItem = z.infer<typeof MessageItemScheme>;

export const LogItemScheme = z.object({
  uuid: z.guid(),
  logTimestamp: z.coerce.date(),
  gameTimestamp: GameDateTimeScheme,
  message: MessageItemScheme,
});
export type LogItem = z.infer<typeof LogItemScheme>;

export const FileNotFoundResponseScheme = z.object({
  path: z.string(),
});
export type FileNotFoundResponse = z.infer<typeof FileNotFoundResponseScheme>;

export const TailSuccessResponseScheme = z.object({
  logItems: z.array(LogItemScheme),
});
export type TailSuccessResponse = z.infer<typeof TailSuccessResponseScheme>;

export interface TailKnownSuccessResponse {
  mode: 'success';
  data: TailSuccessResponse;
}

export interface TailKnownNotFoundResponse {
  mode: 'not-found';
  data: FileNotFoundResponse;
}

export type TailUnknownResponse =
  | TailKnownSuccessResponse
  | TailKnownNotFoundResponse;

export const SimpleResultResponseScheme = z.object({
  success: z.boolean(),
  details: z.object().nullable(),
});
export type SimpleResultResponse = z.infer<typeof SimpleResultResponseScheme>;

//--------------------------------------------
// Elin.Plugin.Main.Models.Settings.Setting.cs
export const LogBufferSettingScheme = z.object({
  capacity: z.number(),
  logFlushLimit: z.number(),
});
export type LogBufferSetting = z.infer<typeof LogBufferSettingScheme>;

export const LogFileSettingScheme = z.object({
  isEnabled: z.boolean(),
  filePath: z.string(),
});
export type LogFileSetting = z.infer<typeof LogFileSettingScheme>;

export const SocketServerSettingScheme = z.object({
  isEnabled: z.boolean(),
  port: z.number(),
  capacity: z.number(),
});
export type SocketServerSetting = z.infer<typeof SocketServerSettingScheme>;

export const SocketClientSettingScheme = z.object({
  isEnabled: z.boolean(),
  port: z.number(),
});
export type SocketClientSetting = z.infer<typeof SocketClientSettingScheme>;

export const WebServerSettingScheme = z.object({
  isEnabled: z.boolean(),
  port: z.number(),
  openBrowserOnStartup: z.boolean(),
});
export type WebServerSetting = z.infer<typeof WebServerSettingScheme>;

export const FrontendSettingScheme = z.object({
  cssFontFamily: z.string(),
  cssFontSize: z.string(),
});
export type FrontendSetting = z.infer<typeof FrontendSettingScheme>;

export const SettingScheme = z.object({
  logBuffer: LogBufferSettingScheme,
  logFile: LogFileSettingScheme,
  socketServer: SocketServerSettingScheme,
  socketClient: SocketClientSettingScheme,
  webServer: WebServerSettingScheme,
  frontend: FrontendSettingScheme,
});
export type Setting = z.infer<typeof SettingScheme>;

export const SettingResponseScheme = z.object({
  setting: SettingScheme,
});
export type SettingResponse = z.infer<typeof SettingResponseScheme>;

export const SettingRequestScheme = z.object({
  setting: SettingScheme,
});
export type SettingRequest = z.infer<typeof SettingRequestScheme>;
