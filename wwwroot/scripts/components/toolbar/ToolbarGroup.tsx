import { Box, Paper, Typography } from '@mui/material';
import type { FC } from 'react';

export interface ToolbarGroupProps {
  title: string;
  children?: React.ReactNode;
}

const ToolbarGroup: FC<ToolbarGroupProps> = (props) => {
  const { title, children } = props;

  return (
    <Paper sx={{ margin: '0.5em 0.5ch', padding: '0.25em 1em' }}>
      <Typography>{title}</Typography>
      <Box>{children}</Box>
    </Paper>
  );
};

export default ToolbarGroup;
