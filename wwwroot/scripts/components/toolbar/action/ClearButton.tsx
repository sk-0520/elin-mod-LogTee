import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, type SxProps, type Theme } from '@mui/material';
import type { FC } from 'react';
import { useLanguageStore } from '../../../hooks/useLanguageStore';
import { clearLog } from '../../../utils/log';

export interface ClearButtonProps {
	sx?: SxProps<Theme>;
}

const ClearButton: FC<ClearButtonProps> = (props) => {
	const { sx } = props;
	const getText = useLanguageStore((a) => a.getText);

	return (
		<Button
			sx={sx}
			startIcon={<DeleteForeverIcon />}
			onClick={() => {
				clearLog();
			}}
		>
			{getText('action.clear')}
		</Button>
	);
};

export default ClearButton;
