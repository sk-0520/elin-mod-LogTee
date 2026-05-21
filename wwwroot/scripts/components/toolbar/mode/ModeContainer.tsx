import { Box, Typography } from '@mui/material';
import type { FC } from 'react';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import { useModeStore } from '../../../stores/useModeStore';
import { toTextId } from '../../../utils/language';

const ModeContainer: FC = () => {
  const mode = useModeStore((a) => a.mode);
  const getText = useLanguageStore((a) => a.getText);

  return (
    <Box sx={{ width: '80px' }}>
      <Typography>{getText(toTextId(mode))}</Typography>
    </Box>
  );
};

export default ModeContainer;
