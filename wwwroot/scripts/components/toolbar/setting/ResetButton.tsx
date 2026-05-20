import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { type FC, useState } from 'react';
import postSettingReset from '../../../api/postSettingReset';
import { useBusyStore } from '../../../stores/useBusyStore';
import { useErrorNotifyStore } from '../../../stores/useErrorNotifyStore';
import { useLanguageStore } from '../../../stores/useLanguageStore';

const ResetButton: FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const getText = useLanguageStore((a) => a.getText);
  const setError = useErrorNotifyStore((a) => a.setError);
  const busyBlock = useBusyStore((a) => a.busyBlock);

  return (
    <>
      <Button
        onClick={async () => {
          setOpenDialog(true);
        }}
      >
        {getText('setting.reset')}
      </Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{getText('setting.reset.confirm')}</DialogTitle>
        <DialogContent>
          <Button
            onClick={async () => {
              try {
                await busyBlock(async () => {
                  await postSettingReset();
                });
              } catch (error) {
                setError(error);
              } finally {
                setOpenDialog(false);
              }
            }}
          >
            {getText('setting.reset.submit')}
          </Button>
          <Button onClick={() => setOpenDialog(false)}>
            {getText('setting.reset.cancel')}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResetButton;
