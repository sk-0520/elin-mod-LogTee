import { dump, get } from './scripts/access';
import {
  getFileStream,
  getSetting,
  getSocketStream,
  getTailApi,
  postSettingReset,
} from './scripts/api';
import { busy, ensureElementById } from './scripts/dom';
import { applyLanguages, getLanguage, type Language } from './scripts/language';
import {
  addLogItem,
  addLogItems,
  addModMessage,
  clearLog,
} from './scripts/log';
import type { EventSourceReceiver } from './scripts/sse';
import { setStatus } from './scripts/status';
import './style.css';
import { applyFrontendSetting } from './scripts/setting';
import {
  type FrontendSetting,
  LogItemScheme,
  type Setting,
} from './scripts/types';

let CurrentEventSourceReceiver: EventSourceReceiver | undefined;

function getQuery(search: string) {
  const params = new URLSearchParams(search);
  return params;
}

async function processFile(language: Language, _setting: FrontendSetting) {
  addModMessage(
    {
      kind: 'Information',
      messageId: 'mod.message.id.stream-client-start',
      details: { type: 'file' },
    },
    language,
  );
  setStatus('stream-file', language);

  try {
    const tailResult = await getTailApi();

    if (tailResult.mode === 'success') {
      for (const logItem of tailResult.data.logItems) {
        addLogItem(logItem, language);
      }
    } else {
      addModMessage(
        {
          kind: 'Error',
          messageId: 'mod.message.id.api-tail-file-not-found',
          details: { path: tailResult.data.path },
        },
        language,
      );
      return;
    }

    const eventSourceReceiver = getFileStream(language);
    CurrentEventSourceReceiver?.cleanup();
    CurrentEventSourceReceiver = eventSourceReceiver;
  } catch (ex) {
    addModMessage(
      {
        kind: 'Error',
        messageId: `mod.message.id.unknown-error`,
        details: dump(ex),
      },
      language,
    );
  }
}

async function processSocket(language: Language, _setting: FrontendSetting) {
  addModMessage(
    {
      kind: 'Information',
      messageId: 'mod.message.id.stream-client-start',
      details: { type: 'socket' },
    },
    language,
  );
  setStatus('stream-socket', language);

  try {
    const eventSourceReceiver = getSocketStream(language);
    CurrentEventSourceReceiver?.cleanup();
    CurrentEventSourceReceiver = eventSourceReceiver;
  } catch (ex) {
    addModMessage(
      {
        kind: 'Error',
        messageId: 'mod.message.id.unknown-error',
        details: dump(ex),
      },
      language,
    );
  }
}

async function processUpload(
  target: HTMLInputElement,
  language: Language,
  _setting: FrontendSetting,
): Promise<void> {
  setStatus('upload', language);

  CurrentEventSourceReceiver?.cleanup();
  CurrentEventSourceReceiver = undefined;

  try {
    const { files } = target;
    if (files && files.length > 0) {
      const file = get(files[0]);
      const text = await file.text();
      const lines = text.split(/\r?\n|\r/);

      const logItems = lines
        .filter((a) => a?.trim())
        .map((a) => {
          const json = JSON.parse(a);
          const logItem = LogItemScheme.parse(json);
          return logItem;
        });
      addLogItems(logItems, language);
    }
  } catch (ex) {
    addModMessage(
      {
        kind: 'Error',
        messageId: `mod.message.id.unknown-error`,
        details: dump(ex),
      },
      language,
    );
  } finally {
    target.value = '';
  }
}

async function processSettingEdit(_language: Language) {
  const settingResult = await busy(() => getSetting());
  const setting = settingResult.setting;
  console.log(setting);
}

async function processSettingReset(language: Language) {
  // confirm/alert が輝いている
  const userResult = confirm(language['setting.reset.confirm']);
  if (!userResult) {
    return;
  }

  try {
    await busy(() => postSettingReset());
    alert(language['setting.reset.warning']);
  } catch (ex) {
    addModMessage(
      {
        kind: 'Error',
        messageId: `mod.message.id.unknown-error`,
        details: dump(ex),
      },
      language,
    );
  }
}

function processInit(language: Language, setting: Setting) {
  setStatus('none', language);

  applyLanguages(language);
  applyFrontendSetting(setting.frontend);

  const elements = {
    stream: {
      file: ensureElementById('stream-file'),
      socket: ensureElementById('stream-socket'),
    },
    log: {
      upload: ensureElementById('log-upload'),
    },
    action: {
      clear: ensureElementById('action-clear'),
      stop: ensureElementById('action-stream-stop'),
    },
    setting: {
      edit: ensureElementById('setting-edit'),
      reset: ensureElementById('setting-reset'),
    },
  };

  elements.stream.file.addEventListener('click', async () => {
    await processFile(language, setting.frontend);
  });

  elements.stream.socket.addEventListener('click', async () => {
    await processSocket(language, setting.frontend);
  });

  elements.log.upload.addEventListener('change', async (e) => {
    if (e.target instanceof HTMLInputElement) {
      await processUpload(e.target, language, setting.frontend);
    }
  });

  elements.action.clear.addEventListener('click', () => {
    clearLog();
  });
  elements.action.stop.addEventListener('click', () => {
    CurrentEventSourceReceiver?.cleanup();
    CurrentEventSourceReceiver = undefined;
  });

  elements.setting.edit.addEventListener('click', () => {
    processSettingEdit(language);
  });
  elements.setting.reset.addEventListener('click', () => {
    processSettingReset(language);
  });
}

async function boot(): Promise<void> {
  const query = getQuery(location.search);
  const language = getLanguage(query.get('lang') ?? undefined);

  const setting = await busy(async () => {
    const settingResult = await getSetting();
    return settingResult.setting;
  });

  processInit(language, setting);

  if (query.get('target') === 'file') {
    await processFile(language, setting.frontend);
  } else if (query.get('target') === 'socket') {
    await processSocket(language, setting.frontend);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  boot();
});
