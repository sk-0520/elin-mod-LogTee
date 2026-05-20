import { Button } from '@mui/material';
import type { FC } from 'react';
import getSocketStream from '../../../api/getSocketStream';
import { useBusyStore } from '../../../stores/useBusyStore';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import { useModeStore } from '../../../stores/useModeStore';
import { useStreamStore } from '../../../stores/useStreamStore';
import { addModMessage } from '../../../utils/log';

const SocketButton: FC = () => {
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
            details: { type: 'socket' },
          },
          language,
        );

        try {
          close();

          setMode('stream-socket');
          await busyBlock(async () => {
            const stream = getSocketStream(language);
            setReceiver('socket', stream);
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
      {getText('stream.socket')}
    </Button>
  );
};

export default SocketButton;
