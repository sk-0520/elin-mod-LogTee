import { Typography } from '@mui/material';
import type { FC } from 'react';
import { usePopupStore } from '../../hooks/usePopupStore';

const PopupCounter: FC = () => {
	const logs = usePopupStore((a) => a.logs);

	return <Typography>{logs.length}</Typography>;
};

export default PopupCounter;
