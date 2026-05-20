import { Button, Dialog } from '@mui/material';
import { type FC, useState } from 'react';
import { getSetting } from '../../../api/getSetting';
import { useBusyStore } from '../../../stores/useBusyStore';
import { useErrorNotifyStore } from '../../../stores/useErrorNotifyStore';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import type { Setting } from '../../../types/csharp';
import EditorContainer from './editor/EditorContainer';

const EditButton: FC = () => {
  const getText = useLanguageStore((state) => state.getText);
  const setError = useErrorNotifyStore((a) => a.setError);
  const busyBlock = useBusyStore((a) => a.busyBlock);
  const [open, setOpen] = useState(false);
  const [setting, setSetting] = useState<Setting | undefined>(undefined);

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={async () => {
          try {
            const settingResult = await busyBlock(
              async () => await getSetting(),
            );
            setSetting(settingResult.setting);
            setOpen(true);
          } catch (error) {
            setError(error);
          }
        }}
      >
        {getText('setting.edit')}
      </Button>
      <Dialog fullWidth open={open} onClose={handleCancel}>
        {setting && (
          <EditorContainer setting={setting} onCancel={handleCancel} />
        )}
      </Dialog>
    </>
  );
};

export default EditButton;
