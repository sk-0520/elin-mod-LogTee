import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Box, IconButton, Stack } from '@mui/material';
import type { FC } from 'react';
import { usePopupStore } from '../../hooks/usePopupStore';
import PopupLogItem from './PopupLogItem';

const PopupDetail: FC = () => {
	const logs = usePopupStore((a) => a.logs);
	const clearLogs = usePopupStore((a) => a.clearLogs);

	return (
		<Box
			sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
		>
			<IconButton onClick={() => clearLogs()}>
				<HighlightOffIcon />
			</IconButton>
			<Stack direction="column" spacing={1} sx={{ mb: 1, maxWidth: '50vw' }}>
				{logs.map((a) => (
					<PopupLogItem key={a.uuid} log={a} />
				))}
			</Stack>
		</Box>
	);
};

export default PopupDetail;
