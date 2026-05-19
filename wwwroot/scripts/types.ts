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
