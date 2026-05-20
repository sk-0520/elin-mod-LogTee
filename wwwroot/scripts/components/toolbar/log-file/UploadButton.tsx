import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { FC } from 'react';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import { useModeStore } from '../../../stores/useModeStore';
import { useStreamStore } from '../../../stores/useStreamStore';
import { LogItemScheme } from '../../../types/csharp';
import { get } from '../../../utils/access';
import { addLogItems, addModMessage } from '../../../utils/log';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadButton: FC = () => {
  const close = useStreamStore((a) => a.close);
  const setMode = useModeStore((a) => a.setMode);
  const getText = useLanguageStore((a) => a.getText);
  const language = useLanguageStore((a) => a.language);

  return (
    <Button
      component="label"
      //variant="contained"
      tabIndex={-1}
      //startIcon={<CloudUploadIcon />}
    >
      {getText('log-file.upload')}
      <VisuallyHiddenInput
        type="file"
        onChange={async (event) => {
          try {
            close();
            setMode('upload');

            const { files } = event.target;
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
                details: ex,
              },
              language,
            );
          } finally {
            event.target.value = '';
          }
        }}
        multiple
      />
    </Button>
  );
};

export default UploadButton;
