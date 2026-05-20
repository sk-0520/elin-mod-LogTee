import { Button } from '@mui/material';
import type { FC } from 'react';
import getSocketStream from '../../../api/getSocketStream';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import { useModeStore } from '../../../stores/useModeStore';
import { useStreamStore } from '../../../stores/useStreamStore';
import { dump } from '../../../utils/access';
import { addModMessage } from '../../../utils/log';

const SocketButton: FC = () => {
  const close = useStreamStore((a) => a.close);
  const setReceiver = useStreamStore((a) => a.setReceiver);
  const setMode = useModeStore((a) => a.setMode);
  const language = useLanguageStore((a) => a.language);
  const getText = useLanguageStore((state) => state.getText);

  return (
    <Button
      onClick={() => {
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
          const stream = getSocketStream(language);
          setReceiver('socket', stream);
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
      }}
    >
      {getText('stream.socket')}
    </Button>
  );
};

export default SocketButton;
