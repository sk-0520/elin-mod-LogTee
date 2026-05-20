import { Button } from '@mui/material';
import type { FC } from 'react';
import getFileStream from '../../../api/getFileStream';
import getTailApi from '../../../api/getTailApi';
import { useBusyStore } from '../../../stores/useBusyStore';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import { useModeStore } from '../../../stores/useModeStore';
import { useStreamStore } from '../../../stores/useStreamStore';
import { addLogItem, addModMessage } from '../../../utils/log';

const FileButton: FC = () => {
  const close = useStreamStore((a) => a.close);
  const setReceiver = useStreamStore((a) => a.setReceiver);
  const setMode = useModeStore((a) => a.setMode);
  const language = useLanguageStore((a) => a.language);
  const getText = useLanguageStore((a) => a.getText);
  const busyBlock = useBusyStore((a) => a.busyBlock);

  return (
    <Button
      onClick={async () => {
        addModMessage(
          {
            kind: 'Information',
            messageId: 'mod.message.id.stream-client-start',
            details: { type: 'file' },
          },
          language,
        );

        try {
          const tailResult = await busyBlock(async () => await getTailApi());

          if (tailResult.mode === 'success') {
            for (const logItem of tailResult.data.logItems) {
              addLogItem(logItem, language);
            }
          } else {
            addModMessage(
              {
                kind: 'Warning',
                messageId: 'mod.message.id.api-tail-file-not-found',
                details: { path: tailResult.data.path },
              },
              language,
            );
            return;
          }

          close();

          setMode('stream-file');
          await busyBlock(async () => {
            const stream = getFileStream(language);
            setReceiver('file', stream);
          });
        } catch (ex) {
          addModMessage(
            {
              kind: 'Error',
              messageId: 'mod.message.id.unknown-error',
              details: ex,
            },
            language,
          );
        }
      }}
    >
      {getText('stream.file')}
    </Button>
  );
};

export default FileButton;
