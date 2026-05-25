import { CircularProgress, Modal } from '@mui/material';
import { type FC, useEffect, useState } from 'react';
import { useBusyStore } from '../../hooks/useBusyStore';

const Busy: FC = () => {
	const isBusy = useBusyStore((a) => a.isBusy);
	const [showBusy, setShowBusy] = useState(false);

	// ちょっとだけ待つのです
	useEffect(() => {
		const timeout = setTimeout(() => {
			setShowBusy(isBusy);
		}, 250);
		return () => clearTimeout(timeout);
	}, [isBusy]);

	return (
		<Modal
			open={showBusy}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<CircularProgress />
		</Modal>
	);
};

export default Busy;
