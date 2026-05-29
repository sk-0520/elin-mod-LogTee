import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IconButton, LinearProgress, Stack } from '@mui/material';
import type { FC } from 'react';
import { usePopupStore } from '../../hooks/usePopupStore';

const PopupHeader: FC = () => {
	const setting = usePopupStore((a) => a.setting);
	const clearLogs = usePopupStore((a) => a.clearLogs);
	const timeoutProgress = usePopupStore((a) => a.timeoutProgress);

	return (
		<Stack
			direction="row"
			spacing={1}
			sx={{
				justifyContent: 'stretch',
				alignItems: 'center',
				width: '100%',
			}}
		>
			{setting.autoClose && (
				<LinearProgress
					sx={{ width: '100%', height: '10px' }}
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
	);
};

export default PopupHeader;
