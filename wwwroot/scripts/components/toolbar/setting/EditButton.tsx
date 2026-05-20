import { Button, Dialog } from '@mui/material';
import { type FC, useState } from 'react';
import { getSetting } from '../../../api/getSetting';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import type { Setting } from '../../../types/csharp';
import EditorContainer from './editor/EditorContainer';

const EditButton: FC = () => {
  const getText = useLanguageStore((state) => state.getText);
  const [open, setOpen] = useState(false);
  const [setting, setSetting] = useState<Setting | undefined>(undefined);

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={async () => {
          const settingResult = await getSetting();
          setSetting(settingResult.setting);
          setOpen(true);
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
