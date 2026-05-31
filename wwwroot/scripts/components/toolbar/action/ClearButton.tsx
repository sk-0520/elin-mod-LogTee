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
	const language = useLanguageStore((a) => a.language);

	return (
		<Button
			sx={sx}
			startIcon={<DeleteForeverIcon />}
			onClick={() => {
				clearLog();
			}}
		>
			{language['action.clear']}
		</Button>
	);
};

export default ClearButton;
