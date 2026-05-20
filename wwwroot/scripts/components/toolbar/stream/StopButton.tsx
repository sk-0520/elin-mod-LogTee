import { Button } from '@mui/material';
import type { FC } from 'react';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import { useModeStore } from '../../../stores/useModeStore';
import { useStreamStore } from '../../../stores/useStreamStore';

const StopButton: FC = () => {
  const close = useStreamStore((a) => a.close);
  const setMode = useModeStore((a) => a.setMode);
  const getText = useLanguageStore((state) => state.getText);

  return (
    <Button
      onClick={() => {
        close();
        setMode('none');
      }}
    >
      {getText('stream.stop')}
    </Button>
  );
};

export default StopButton;
