import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { FC } from 'react';
import { useFrontendSettingStore } from '../../../hooks/useFrontendSetting';
import { useLanguageStore } from '../../../hooks/useLanguageStore';
import { useModeStore } from '../../../hooks/useModeStore';
import { useStreamStore } from '../../../hooks/useStreamStore';
import { LogItemScheme } from '../../../types/csharp';
import { get } from '../../../utils/access';
import { addLogItems, addModMessage } from '../../../utils/log';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

const UploadButton: FC = () => {
	const close = useStreamStore((a) => a.close);
	const setMode = useModeStore((a) => a.setMode);
	const language = useLanguageStore((a) => a.language);
	const mode = useModeStore((a) => a.mode);
	const highlightSetting = useFrontendSettingStore((a) => a.highlight);

	return (
		<Button
			component="label"
			startIcon={<UploadFileIcon />}
			variant={mode === 'upload' ? 'contained' : undefined}
		>
			{language['log-file.upload']}
			<VisuallyHiddenInput
				type="file"
				tabIndex={-1}
				onChange={async (event) => {
					try {
						close();

						const { files } = event.target;
						if (files && files.length > 0) {
							setMode('upload');

							const file = get(files[0]);
							const text = await file.text();
							const lines = text.split(/\r?\n|\r/);

							const logItems = lines
								.filter((a) => a?.trim())
								.map((a) => {
									const json = JSON.parse(a);
									const logItem = LogItemScheme.parse(json);
									return logItem;
								});
							addModMessage(
								{
									kind: 'Information',
									messageId: `mod.message.id.file-upload`,
								},
								language,
							);
							addLogItems(logItems, highlightSetting, language);
						}
					} catch (ex) {
						addModMessage(
							{
								kind: 'Error',
								messageId: `mod.message.id.unknown-error`,
								details: ex,
							},
							language,
						);
						setMode('none');
					} finally {
						event.target.value = '';
					}
				}}
			/>
		</Button>
	);
};

export default UploadButton;
