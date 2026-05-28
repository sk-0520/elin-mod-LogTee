/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: ${...} の説明なのでOK */
import type { LanguageItem } from './language';

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
	'mode.enum.stream-socket': {
		jp: 'ソケット',
		en: 'Socket',
		cn: '套接字',
	},
	'mode.enum.stream-file': {
		jp: 'ファイル',
		en: 'File',
		cn: '文件',
	},
	'mode.enum.upload': {
		jp: 'アップロード',
		en: 'Upload',
		cn: '上传',
	},
	'stream.title': {
		jp: 'ストリーム',
		en: 'Stream',
		cn: '流',
	},
	'stream.socket': {
		jp: 'ソケット',
		en: 'Socket',
		cn: '套接字',
	},
	'stream.file': {
		jp: 'ファイル',
		en: 'File',
		cn: '文件',
	},
	'stream.stop': {
		jp: '停止',
		en: 'Stop',
		cn: '停止',
	},
	'log-file.title': {
		jp: 'ログファイル',
		en: 'Log File',
		cn: '日志文件',
	},
	'log-file.upload': {
		jp: 'アップロード',
		en: 'Upload',
		cn: '上传',
	},
	'action.title': {
		jp: 'アクション',
		en: 'Action',
		cn: '操作',
	},
	'action.clear': {
		jp: 'ログクリア',
		en: 'Clear Log',
		cn: '清除日志',
	},
	'action.setting-editor': {
		jp: '設定',
		en: 'Setting',
		cn: '设置',
	},
	'error-dialog.title': {
		jp: 'エラー',
		en: 'Error',
		cn: '错误',
	},
	'error-dialog.close': {
		jp: '閉じる',
		en: 'Close',
		cn: '关闭',
	},

	//--------------------------------------------
	// 設定UI
	'setting.editor.title': {
		jp: '設定の編集',
		en: 'Edit Setting',
		cn: '编辑设置',
	},
	'setting.apply.warning': {
		jp: '全ての設定反映には Elin の再起動が必要です',
		en: 'Applying settings requires restarting Elin.',
		cn: '应用设置需要重启 Elin。',
	},
	'setting.editor.reset': {
		jp: 'リセット',
		en: 'Reset',
		cn: '重置',
	},
	'setting.reset.confirm': {
		jp: 'リセットしますか？',
		en: 'Are you sure you want to reset?',
		cn: '您确定要重置吗？',
	},
	'setting.reset.submit': {
		jp: 'リセット',
		en: 'Reset',
		cn: '重置',
	},
	'setting.reset.cancel': {
		jp: 'キャンセル',
		en: 'Cancel',
		cn: '取消',
	},
	'setting.editor.save': {
		jp: '保存',
		en: 'Save',
		cn: '保存',
	},
	'setting.editor.cancel': {
		jp: 'キャンセル',
		en: 'Cancel',
		cn: '取消',
	},
	'setting.editor.description.title': {
		jp: '説明',
		en: 'Description',
		cn: '描述',
	},
	// logBuffer
	'setting.editor.logBuffer.title': {
		jp: 'ログバッファ',
		en: 'Log Buffer',
		cn: '日志缓冲区',
	},
	'setting.editor.logBuffer.capacity': {
		jp: '容量',
		en: 'Capacity',
		cn: '容量',
	},
	'setting.editor.logBuffer.logFlushLimit': {
		jp: '反映までの制限',
		en: 'Flush Limit',
		cn: '刷新限制',
	},
	'setting.editor.logBuffer.logFlushInterval': {
		jp: '反映間隔(msec)',
		en: 'Flush Interval (msec)',
		cn: '刷新间隔（毫秒）',
	},
	'setting.editor.logBuffer.description': {
		jp: 'ログバッファは Elin が出力するログを一時的に保存する領域です。制限を超えるか間隔が経過すると、バッファ内のログが設定に応じて転送先に出力します。',
		en: 'The log buffer temporarily stores logs output by Elin. When the limit is exceeded or the interval elapses, buffered logs are output to destinations according to the settings.',
		cn: '日志缓冲区是用于临时保存 Elin 输出日志的区域。当超过限制或经过设定间隔后，缓冲区中的日志会根据设置输出到目标位置。',
	},
	// logFile
	'setting.editor.logFile.title': {
		jp: 'ログファイル',
		en: 'Log File',
		cn: '日志文件',
	},
	'setting.editor.logFile.isEnabled': {
		jp: '有効',
		en: 'Enabled',
		cn: '启用',
	},
	'setting.editor.logFile.filePath': {
		jp: 'ファイルパス',
		en: 'File Path',
		cn: '文件路径',
	},
	'setting.editor.logFile.description': {
		jp: 'ログバッファの出力先としてファイルを使用します。ファイル名には ${YYYY}, ${MM}, ${DD} を変数と使用でき、それぞれローカル時間の年・月・日に置換されます。ちなみにストリームとしての使用はあまり考慮しておらず、ログをため込むことを目的としています。',
		en: 'Uses a file as the output destination of the log buffer. You can use ${YYYY}, ${MM}, and ${DD} as variables in the file name, which are replaced with the local year, month, and day. It is not primarily designed for streaming use, but for accumulating logs.',
		cn: '将文件用作日志缓冲区的输出目标。文件名可使用 ${YYYY}、${MM}、${DD} 作为变量，分别替换为本地时间的年、月、日。顺便一提，本功能并未特别考虑作为流式用途，主要目的是累积日志。',
	},
	// socketClient
	'setting.editor.socketClient.title': {
		jp: 'ソケットクライアント',
		en: 'Socket Client',
		cn: '套接字客户端',
	},
	'setting.editor.socketClient.isEnabled': {
		jp: '有効',
		en: 'Enabled',
		cn: '启用',
	},
	'setting.editor.socketClient.hostName': {
		jp: 'ホスト名',
		en: 'Host Name',
		cn: '主机名',
	},
	'setting.editor.socketClient.port': {
		jp: 'ポート',
		en: 'Port',
		cn: '端口',
	},
	'setting.editor.socketClient.description': {
		jp: 'ログバッファの出力先としてソケット通信を使用します。現状は TCP で固定されています。ソケットサーバー・Webサーバーを組み合わせてストリームとして使用することを想定しています。独自のサーバーで受信する場合、各種データ構造は Mod 実装を参照してください。',
		en: 'Uses socket communication as an output destination for the log buffer. It is currently fixed to TCP. It is intended to be used as a stream in combination with a socket server and web server. If you receive data on your own server, refer to the Mod implementation for data structures.',
		cn: '将套接字通信用作日志缓冲区的输出目标。目前固定为 TCP。预期与套接字服务器和 Web 服务器组合后作为流使用。如果要在自定义服务器接收数据，请参考 Mod 实现中的各类数据结构。',
	},
	// socketServer
	'setting.editor.socketServer.title': {
		jp: 'ソケットサーバー',
		en: 'Socket Server',
		cn: '套接字服务器',
	},
	'setting.editor.socketServer.isEnabled': {
		jp: '有効',
		en: 'Enabled',
		cn: '启用',
	},
	'setting.editor.socketServer.port': {
		jp: 'ポート',
		en: 'Port',
		cn: '端口',
	},
	'setting.editor.socketServer.capacity': {
		jp: '容量',
		en: 'Capacity',
		cn: '容量',
	},
	'setting.editor.socketServer.description': {
		jp: 'ソケットクライアントの送信先として使用することを想定しており、外部からの受信は考慮していません。容量を超過した場合は古いログから破棄されます。',
		en: 'Intended to be used as the destination for the socket client and does not consider receiving from external sources. If capacity is exceeded, older logs are discarded first.',
		cn: '该功能预期作为套接字客户端的发送目标使用，不考虑来自外部的接收。当容量超出时，会从旧日志开始丢弃。',
	},
	// webServer
	'setting.editor.webServer.title': {
		jp: 'Webサーバー',
		en: 'Web Server',
		cn: 'Web 服务器',
	},
	'setting.editor.webServer.isEnabled': {
		jp: '有効',
		en: 'Enabled',
		cn: '启用',
	},
	'setting.editor.webServer.port': {
		jp: 'ポート',
		en: 'Port',
		cn: '端口',
	},
	'setting.editor.webServer.openBrowserOnStartup': {
		jp: '起動時にブラウザを開く',
		en: 'Open Browser on Startup',
		cn: '启动时打开浏览器',
	},
	'setting.editor.webServer.description': {
		jp: 'ログファイルの表示やソケットサーバー・ログファイルのログをストリームとして表示、その他には設定機能を提供します。基本的にはソケットサーバー内のログ表示を想定しています。',
		en: 'Provides log file viewing, stream display of logs from the socket server and log files, and other setting features. It is primarily intended to display logs in the socket server.',
		cn: '提供日志文件查看、将套接字服务器与日志文件的日志以流形式显示，以及其他设置功能。基本上是为显示套接字服务器内的日志而设计。',
	},
	// frontend
	'setting.editor.frontend.title': {
		jp: 'フロントエンド',
		en: 'Frontend',
		cn: '前端',
	},
	'setting.editor.frontend.cssFontFamily': {
		jp: 'CSS フォントファミリー',
		en: 'CSS Font Family',
		cn: 'CSS 字体族',
	},
	'setting.editor.frontend.cssFontSize': {
		jp: 'CSS フォントサイズ',
		en: 'CSS Font Size',
		cn: 'CSS 字体大小',
	},
	'setting.editor.frontend.elementLimit': {
		jp: 'ログ要素制限',
		en: 'Log Element Limit',
		cn: '日志元素限制',
	},
	'setting.editor.frontend.description': {
		jp: 'ログ表示周りの設定です。CSS にてフォント・サイズを指定してください。ログ要素数制限はストリーム受信中ログ要素数の上限となり、端末の性能に依存するためいい感じの塩梅で設定してください。',
		en: 'Settings related to log display. Specify font and size in CSS. The log element limit is the maximum number of log elements while receiving streams, so tune it appropriately based on your device performance.',
		cn: '这是与日志显示相关的设置。请在 CSS 中指定字体和大小。日志元素数量限制是在接收流期间日志元素数的上限，请根据设备性能调整到合适的值。',
	},

	'setting.editor.frontend.highlight.title': {
		jp: 'ハイライト',
		en: 'Highlight',
		cn: '高亮',
	},

	'setting.editor.frontend.highlight.addItem': {
		jp: 'ハイライト項目追加',
		en: 'Add Highlight Item',
		cn: '添加高亮项',
	},

	'setting.editor.frontend.highlight.popup.limit.title': {
		jp: 'ポップアップ表示制限',
		en: 'Popup Display Limit',
		cn: '弹出显示限制',
	},

	'setting.editor.frontend.highlight.item.display.title': {
		jp: '表示方法',
		en: 'Display Method',
		cn: '显示方法',
	},

	'setting.editor.frontend.highlight.item.display.enum.inline': {
		jp: 'インライン',
		en: 'Inline',
		cn: '内联',
	},
	'setting.editor.frontend.highlight.item.display.enum.block': {
		jp: 'ブロック',
		en: 'Block',
		cn: '块',
	},
	'setting.editor.frontend.highlight.item.display.enum.popup': {
		jp: 'ポップアップ',
		en: 'Popup',
		cn: '弹出',
	},

	'setting.editor.frontend.highlight.item.match.title': {
		jp: '適用方法',
		en: 'Match Method',
		cn: '匹配方法',
	},
	'setting.editor.frontend.highlight.item.match.enum.contains': {
		jp: '部分一致',
		en: 'Contains',
		cn: '包含',
	},
	'setting.editor.frontend.highlight.item.match.enum.startsWith': {
		jp: '前方一致',
		en: 'Starts With',
		cn: '以...开头',
	},
	'setting.editor.frontend.highlight.item.match.enum.endsWith': {
		jp: '後方一致',
		en: 'Ends With',
		cn: '以...结尾',
	},
	'setting.editor.frontend.highlight.item.match.enum.equals': {
		jp: '完全一致',
		en: 'Equals',
		cn: '完全匹配',
	},
	'setting.editor.frontend.highlight.item.match.enum.regex': {
		jp: '正規表現',
		en: 'Regular Expression',
		cn: '正则表达式',
	},

	'setting.editor.frontend.highlight.item.pattern.title': {
		jp: 'パターン',
		en: 'Pattern',
		cn: '模式',
	},

	'setting.editor.frontend.highlight.item.ignoreCase.title': {
		jp: '大文字小文字を無視',
		en: 'Ignore Case',
		cn: '忽略大小写',
	},

	'setting.editor.frontend.highlight.description': {
		jp: '表示されたログに対して特定の文言に場合に強調するための設定です。正規表現は JavaScript の RegExp に準拠します。ポップアップはログの内容を別途表示するものです。',
		en: 'Settings for highlighting specific phrases in displayed logs. Regular expressions follow JavaScript RegExp. Popup is for displaying log content separately.',
		cn: '用于突出显示显示日志中特定短语的设置。正则表达式遵循 JavaScript RegExp。弹出是用于单独显示日志内容的。',
	},

	//--------------------------------------------
	// 検証
	'validation.required': {
		jp: '必須項目です',
		en: 'This field is required',
		cn: '这是必填项',
	},
	'validation.min.format': {
		jp: '最小値: ${VALUE}',
		en: 'Minimum Value: ${VALUE}',
		cn: '最小值: ${VALUE}',
	},
	'validation.max.format': {
		jp: '最大値: ${VALUE}',
		en: 'Maximum Value: ${VALUE}',
		cn: '最大值: ${VALUE}',
	},
	'validation.regex.format': {
		jp: '正規表現が不正です: ${VALUE}',
		en: 'Invalid Regular Expression: ${VALUE}',
		cn: '正则表达式无效: ${VALUE}',
	},

	//--------------------------------------------
	// ModMessageId
	'mod.message.id.unknown-error': {
		jp: '不明なエラー',
		en: 'Unknown Error',
		cn: '未知错误',
	},
	'mod.message.id.title': {
		jp: 'タイトル画面',
		en: 'Title Screen',
		cn: '标题画面',
	},
	'mod.message.id.start-game': {
		jp: 'ゲーム開始',
		en: 'Start Game',
		cn: '开始游戏',
	},
	'mod.message.id.exit': {
		jp: '終了',
		en: 'Exit',
		cn: '退出',
	},
	'mod.message.id.stream-server-error': {
		jp: 'SSE サーバーエラー',
		en: 'SSE Server Error',
		cn: 'SSE 服务器错误',
	},
	'mod.message.id.stream-client-error': {
		jp: 'SSE クライアントエラー',
		en: 'SSE Client Error',
		cn: 'SSE 客户端错误',
	},
	'mod.message.id.stream-client-start': {
		jp: 'SSE クライアント開始',
		en: 'SSE Client Start',
		cn: 'SSE 客户端启动',
	},
	'mod.message.id.stream-client-open': {
		jp: 'SSE クライアント接続',
		en: 'SSE Client Connect',
		cn: 'SSE 客户端连接',
	},
	'mod.message.id.stream-client-stop': {
		jp: 'SSE クライアント停止',
		en: 'SSE Client Stop',
		cn: 'SSE 客户端停止',
	},
	'mod.message.id.file-upload': {
		jp: 'ファイルアップロード',
		en: 'File Upload',
		cn: '文件上传',
	},
	'mod.message.id.api-tail-file-not-found': {
		jp: 'API ファイルが見つかりません',
		en: 'API File Not Found',
		cn: '未找到 API 文件',
	},
} as const satisfies { [key in string]: LanguageItem };

export default LanguageItems;
