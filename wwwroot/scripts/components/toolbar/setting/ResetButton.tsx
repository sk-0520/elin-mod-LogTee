import { Button } from '@mui/material';
import type { FC } from 'react';
import postSettingReset from '../../../api/postSettingReset';
import { useBusyStore } from '../../../stores/useBusyStore';
import { useErrorNotifyStore } from '../../../stores/useErrorNotifyStore';
import { useLanguageStore } from '../../../stores/useLanguageStore';

const ResetButton: FC = () => {
  const getText = useLanguageStore((state) => state.getText);
  const setError = useErrorNotifyStore((a) => a.setError);
  const busyBlock = useBusyStore((a) => a.busyBlock);

  return (
    <Button
      onClick={async () => {
        try {
          await busyBlock(async () => await postSettingReset());
        } catch (error) {
          setError(error);
        }
      }}
    >
      {getText('setting.reset')}
    </Button>
  );
};

export default ResetButton;
