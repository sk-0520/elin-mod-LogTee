import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Button, type SxProps, type Theme } from '@mui/material';
import type { FC } from 'react';
import getSocketStream from '../../../api/getSocketStream';
import { useBusyStore } from '../../../stores/useBusyStore';
import { useFrontendSettingStore } from '../../../stores/useFrontendSetting';
import { useLanguageStore } from '../../../stores/useLanguageStore';
import { useModeStore } from '../../../stores/useModeStore';
import { useStreamStore } from '../../../stores/useStreamStore';
import { addModMessage } from '../../../utils/log';
export interface SocketButtonProps {
	sx?: SxProps<Theme>;
}

const SocketButton: FC<SocketButtonProps> = (props) => {
	const { sx } = props;
	const close = useStreamStore((a) => a.close);
	const setReceiver = useStreamStore((a) => a.setReceiver);
	const setMode = useModeStore((a) => a.setMode);
	const language = useLanguageStore((a) => a.language);
	const getText = useLanguageStore((a) => a.getText);
	const busyBlock = useBusyStore((a) => a.busyBlock);
	const mode = useModeStore((a) => a.mode);
	const frontendSetting = useFrontendSettingStore((a) => a.setting);

	return (
		<Button
			id="stream-socket-command"
			sx={sx}
			startIcon={<PlayCircleIcon />}
			variant={mode === 'stream-socket' ? 'contained' : undefined}
			onClick={async () => {
				addModMessage(
					{
						kind: 'Information',
						messageId: 'mod.message.id.stream-client-start',
						details: { type: 'socket' },
					},
					language,
				);

				setMode('stream-socket');
				try {
					close();

					await busyBlock(async () => {
						const stream = getSocketStream(
							frontendSetting.elementLimit,
							language,
						);
						setReceiver('socket', stream);
					});
				} catch (ex) {
					addModMessage(
						{
							kind: 'Error',
							messageId: 'mod.message.id.unknown-error',
							details: ex,
						},
						language,
					);
					setMode('none');
				}
			}}
		>
			{getText('stream.socket')}
		</Button>
	);
};

export default SocketButton;
