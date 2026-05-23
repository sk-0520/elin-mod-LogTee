import type { FC } from 'react';
import ClearButton from './ClearButton';
import SettingEditorButton from './SettingEditorButton';

const ActionContainer: FC = () => {
	return (
		<>
			<ClearButton />
			<SettingEditorButton sx={{ ml: 1 }} />
		</>
	);
};

export default ActionContainer;
