import ReplyIcon from '@mui/icons-material/Reply';
import { Box, IconButton, Typography } from '@mui/material';
import type { FC } from 'react';
import type { LogItem } from '../../types/csharp';
import { getLogItemId } from '../../utils/log';

export interface PopupLogItemProps {
	log: LogItem;
}
const PopupLogItem: FC<PopupLogItemProps> = (props) => {
	const { log } = props;

	const handleClick = () => {
		const id = getLogItemId(log.uuid);
		// 要素有無の保証は出来ないので ensureElementById は使用しない
		// ログの能動的削除を実装したため、要素が存在しない可能性がある
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	};

	return (
		<Box>
			<Typography>
				<IconButton onClick={handleClick}>
					<ReplyIcon />
				</IconButton>
				{log.message.message}
			</Typography>
		</Box>
	);
};

export default PopupLogItem;
