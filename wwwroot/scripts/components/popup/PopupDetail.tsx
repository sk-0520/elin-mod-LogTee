import { Stack } from '@mui/material';
import type { FC } from 'react';
import { usePopupStore } from '../../hooks/usePopupStore';
import PopupLogItem from './PopupLogItem';

const PopupDetail: FC = () => {
	const logs = usePopupStore((a) => a.logs);

	return (
		<Stack direction="column" spacing={1} sx={{ mb: 1, maxWidth: '50vw' }}>
			{logs.map((a) => (
				<PopupLogItem key={a.uuid} log={a} />
			))}
		</Stack>
	);
};

export default PopupDetail;
