import { Button } from '@mui/material';
import type { FC } from 'react';
import postSettingReset from '../../../api/postSettingReset';
import { useLanguageStore } from '../../../stores/useLanguageStore';

const ResetButton: FC = () => {
  const getText = useLanguageStore((state) => state.getText);

  return (
    <Button
      onClick={async () => {
        await postSettingReset();
      }}
    >
      {getText('setting.reset')}
    </Button>
  );
};

export default ResetButton;
