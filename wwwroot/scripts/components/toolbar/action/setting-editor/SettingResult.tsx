import { Typography } from '@mui/material';
import type { FC } from 'react';

export interface SettingResultProps {
	data: string;
}
const SettingResult: FC<SettingResultProps> = (props) => {
	const { data } = props;
	return <Typography variant="body1">{data}</Typography>;
};

export default SettingResult;
