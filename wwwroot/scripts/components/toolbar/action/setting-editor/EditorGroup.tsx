import { Paper, Stack, Typography } from '@mui/material';
import type { FC } from 'react';

export interface EditorGroupProps {
	title: string;
	children?: React.ReactNode;
}

const EditorGroup: FC<EditorGroupProps> = (props) => {
	const { title, children } = props;
	return (
		<Paper variant="outlined" sx={{ margin: '1em', padding: '0.5em' }}>
			<Typography
				sx={{
					position: 'sticky',
					top: 0,
					zIndex: 1100,
					bgcolor: 'background.paper',
					padding: '0.5em',
				}}
			>
				{title}
			</Typography>

			<Stack
				spacing={2}
				sx={{
					margin: '0.5em 0 0.8em 1.5em',
				}}
			>
				{children}
			</Stack>
		</Paper>
	);
};

export default EditorGroup;
