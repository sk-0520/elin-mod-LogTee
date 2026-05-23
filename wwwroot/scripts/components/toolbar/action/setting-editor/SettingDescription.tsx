import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import type { FC } from 'react';
import { useLanguageStore } from '../../../../stores/useLanguageStore';

export interface SettingDescriptionProps {
	children: React.ReactNode;
}

const SettingDescription: FC<SettingDescriptionProps> = (props) => {
	const { children } = props;
	const getText = useLanguageStore((a) => a.getText);

	return (
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				{getText('setting.editor.description.title')}
			</AccordionSummary>
			<AccordionDetails>{children}</AccordionDetails>
		</Accordion>
	);
};

export default SettingDescription;
