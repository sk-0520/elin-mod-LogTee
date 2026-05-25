import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Dialog, type SxProps, type Theme } from '@mui/material';
import { type FC, useState } from 'react';
import { getSetting } from '../../../api/getSetting';
import { useBusyStore } from '../../../hooks/useBusyStore';
import { useErrorNotifyStore } from '../../../hooks/useErrorNotifyStore';
import { useLanguageStore } from '../../../hooks/useLanguageStore';
import type { Setting } from '../../../types/csharp';
import EditorContainer from './setting-editor/EditorContainer';

export interface SettingEditorButtonProps {
	sx?: SxProps<Theme>;
}
const SettingEditorButton: FC<SettingEditorButtonProps> = (props) => {
	const { sx } = props;
	const getText = useLanguageStore((a) => a.getText);
	const setError = useErrorNotifyStore((a) => a.setError);
	const busyBlock = useBusyStore((a) => a.busyBlock);
	const [open, setOpen] = useState(false);
	const [setting, setSetting] = useState<Setting | undefined>(undefined);

	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<>
			<Button
				sx={sx}
				startIcon={<SettingsIcon />}
				onClick={async () => {
					try {
						const settingResult = await busyBlock(
							async () => await getSetting(),
						);
						setSetting(settingResult.setting);
						setOpen(true);
					} catch (error) {
						setError(error);
						setOpen(false);
					}
				}}
			>
				{getText('action.setting-editor')}
			</Button>
			<Dialog fullWidth open={open} onClose={handleCancel}>
				{setting && (
					<EditorContainer setting={setting} onCancel={handleCancel} />
				)}
			</Dialog>
		</>
	);
};

export default SettingEditorButton;
