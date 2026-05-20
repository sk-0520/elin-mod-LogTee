import { Box, Typography } from '@mui/material';
import type { FC } from 'react';

export interface ToolbarGroupProps {
  title: string;
  children?: React.ReactNode;
}

const ToolbarGroup: FC<ToolbarGroupProps> = (props) => {
  const { title, children } = props;

  return (
    <Box>
      <Typography>{title}</Typography>
      {children}
    </Box>
  );
};

export default ToolbarGroup;
