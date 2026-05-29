import { Box, Stack } from '@mui/material';
import type { FC } from 'react';
import { usePopupStore } from '../../hooks/usePopupStore';
import PopupHeader from './PopupHeader';
import PopupLogItem from './PopupLogItem';

const PopupDetail: FC = () => {
	const logs = usePopupStore((a) => a.logs);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'stretch',
				alignItems: 'flex-end',
			}}
		>
			<PopupHeader />

			<Stack
				direction="column"
				spacing={1}
				sx={{ mb: 1, maxWidth: '50vw', overflow: 'auto', maxHeight: '80vh' }}
			>
				{logs.map((a) => (
					<PopupLogItem key={a.uuid} log={a} />
				))}
			</Stack>
		</Box>
	);
};

export default PopupDetail;
