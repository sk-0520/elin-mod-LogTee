import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import type { FC } from 'react';
import { useLanguageStore } from '../../../../hooks/useLanguageStore';

export interface ResetIconProps {
	onReset?: () => void;
	resetPosition?: 'start' | 'end';
}

const ResetIcon: FC<ResetIconProps> = (props) => {
	const { onReset, resetPosition } = props;
	const language = useLanguageStore((a) => a.language);

	return (
		<InputAdornment position={resetPosition ?? 'end'}>
			<Tooltip title={language['setting.editor.reset.title']}>
				<IconButton onClick={onReset}>
					<RestartAltIcon />
				</IconButton>
			</Tooltip>
		</InputAdornment>
	);
};

export default ResetIcon;
