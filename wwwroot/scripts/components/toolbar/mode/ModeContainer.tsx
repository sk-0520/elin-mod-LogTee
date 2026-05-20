import { Typography } from '@mui/material';
import type { FC } from 'react';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import { useModeStore } from '../../../stores/useModeStore';
import { toTextId } from '../../../utils/language';

const ModeContainer: FC = () => {
  const mode = useModeStore((a) => a.mode);
  const getText = useLanguageStore((state) => state.getText);

  return <Typography>{getText(toTextId(mode))}</Typography>;
};

export default ModeContainer;
