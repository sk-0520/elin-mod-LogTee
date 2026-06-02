import { Box, Paper, Typography } from '@mui/material';
import type { FC } from 'react';

export interface ToolbarGroupProps {
	title: string;
	children?: React.ReactNode;
}

const ToolbarGroup: FC<ToolbarGroupProps> = (props) => {
	const { title, children } = props;

	return (
		<Paper
			variant="outlined"
			square
			sx={{
				margin: '0.5em 0.5ch',
				padding: '0.25em 1em',
				backgroundColor: 'transparent',
			}}
		>
			<Typography
				sx={{ color: '#642504', fontSize: '0.8em', fontWeight: 'bold' }}
			>
				{title}
			</Typography>
			<Box>{children}</Box>
		</Paper>
	);
};

export default ToolbarGroup;
