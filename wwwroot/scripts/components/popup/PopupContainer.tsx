import AnnouncementIcon from '@mui/icons-material/Announcement';
import {
	styled,
	Tooltip,
	type TooltipProps,
	tooltipClasses,
} from '@mui/material';
import Button from '@mui/material/Button';
import type { FC } from 'react';
import { usePopupStore } from '../../hooks/usePopupStore';
import PopupCounter from './PopupCounter';
import PopupDetail from './PopupDetail';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
		maxWidth: 'none',
	},
	[`& .${tooltipClasses.arrow}`]: {
		color: theme.palette.common.white,
	},
}));

const PopupContainer: FC = () => {
	const hasLogs = usePopupStore((a) => a.hasLogs);
	const openDetail = usePopupStore((a) => a.openDetail);
	const setOpenDetail = usePopupStore((a) => a.setOpenDetail);

	const handleClick = () => {
		setOpenDetail(!openDetail);
	};

	return (
		<LightTooltip
			placement="top-end"
			open={hasLogs && openDetail}
			title={<PopupDetail />}
			arrow
		>
			<Button
				disabled={!hasLogs}
				startIcon={<AnnouncementIcon />}
				variant={openDetail ? 'contained' : 'outlined'}
				sx={{
					position: 'fixed',
					bottom: 0,
					right: 0,
					m: 1,
				}}
				onClick={handleClick}
			>
				<PopupCounter />
			</Button>
		</LightTooltip>
	);
};

export default PopupContainer;
