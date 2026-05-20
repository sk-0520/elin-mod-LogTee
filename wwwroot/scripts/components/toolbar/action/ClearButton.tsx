import { Button } from '@mui/material';
import type { FC } from 'react';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import { clearLog } from '../../../utils/log';

const ClearButton: FC = () => {
  const getText = useLanguageStore((state) => state.getText);

  return (
    <Button
      onClick={() => {
        clearLog();
      }}
    >
      {getText('action.clear')}
    </Button>
  );
};

export default ClearButton;
