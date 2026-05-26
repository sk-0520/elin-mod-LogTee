import { Typography } from '@mui/material';
import type { FC } from 'react';

export interface SettingResultProps {
	display: string;
}
const SettingResult: FC<SettingResultProps> = (props) => {
	const { display } = props;
	return <Typography variant="body1">{display}</Typography>;
};

export default SettingResult;
