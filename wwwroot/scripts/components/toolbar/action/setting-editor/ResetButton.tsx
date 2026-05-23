import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	styled,
} from '@mui/material';
import { type FC, useState } from 'react';
import postSettingReset from '../../../../api/postSettingReset';
import { useBusyStore } from '../../../../stores/useBusyStore';
import { useErrorNotifyStore } from '../../../../stores/useErrorNotifyStore';
import { useLanguageStore } from '../../../../stores/useLanguageStore';

const StyledDialogActionButton = styled(Button)({
	flex: 1,
	margin: '1em',
});

const ResetButton: FC = () => {
	const [openDialog, setOpenDialog] = useState(false);
	const getText = useLanguageStore((a) => a.getText);
	const setError = useErrorNotifyStore((a) => a.setError);
	const busyBlock = useBusyStore((a) => a.busyBlock);

	return (
		<>
			<Button
				variant="contained"
				color="warning"
				onClick={async () => {
					setOpenDialog(true);
				}}
			>
				{getText('setting.editor.reset')}
			</Button>
			<Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>{getText('setting.reset.confirm')}</DialogTitle>
				<DialogContent sx={{ display: 'flex', justifyContent: 'space-around' }}>
					<StyledDialogActionButton
						variant="contained"
						color="warning"
						onClick={async () => {
							try {
								await busyBlock(async () => {
									await postSettingReset();
								});
								// EditorContainer.tsx: onSubmit 参照
								location.reload();
							} catch (error) {
								setError(error);
							} finally {
								setOpenDialog(false);
							}
						}}
					>
						{getText('setting.reset.submit')}
					</StyledDialogActionButton>
					<StyledDialogActionButton
						variant="contained"
						color="secondary"
						onClick={() => setOpenDialog(false)}
					>
						{getText('setting.reset.cancel')}
					</StyledDialogActionButton>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ResetButton;
