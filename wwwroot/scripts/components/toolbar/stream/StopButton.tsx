import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Button, type SxProps, type Theme } from '@mui/material';
import type { FC } from 'react';
import { useLanguageStore } from '../../../hooks/useLanguageStore';
import { useModeStore } from '../../../hooks/useModeStore';
import { useStreamStore } from '../../../hooks/useStreamStore';

export interface StopButtonProps {
	sx?: SxProps<Theme>;
}

const StopButton: FC<StopButtonProps> = (props) => {
	const { sx } = props;
	const close = useStreamStore((a) => a.close);
	const setMode = useModeStore((a) => a.setMode);
	const getText = useLanguageStore((a) => a.getText);

	return (
		<Button
			sx={sx}
			startIcon={<StopCircleIcon />}
			onClick={() => {
				close();
				setMode('none');
			}}
		>
			{getText('stream.stop')}
		</Button>
	);
};

export default StopButton;
