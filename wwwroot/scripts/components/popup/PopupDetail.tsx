import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Box, IconButton, LinearProgress, Stack } from '@mui/material';
import type { FC } from 'react';
import { usePopupStore } from '../../hooks/usePopupStore';
import PopupLogItem from './PopupLogItem';

const PopupDetail: FC = () => {
	const logs = usePopupStore((a) => a.logs);
	const setting = usePopupStore((a) => a.setting);
	const clearLogs = usePopupStore((a) => a.clearLogs);
	const timeoutProgress = usePopupStore((a) => a.timeoutProgress);

	return (
		<Box
			sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
		>
			<Stack
				direction="row"
				spacing={1}
				sx={{ justifyContent: 'center', alignItems: 'center' }}
			>
				{setting.autoClose && (
					<LinearProgress
						sx={{ width: '100px', height: '10px' }}
						variant="determinate"
						color="info"
						min={0}
						max={1}
						value={timeoutProgress}
					/>
				)}
				<IconButton onClick={() => clearLogs()}>
					<HighlightOffIcon />
				</IconButton>
			</Stack>

			<Stack direction="column" spacing={1} sx={{ mb: 1, maxWidth: '50vw' }}>
				{logs.map((a) => (
					<PopupLogItem key={a.uuid} log={a} />
				))}
			</Stack>
		</Box>
	);
};

export default PopupDetail;
