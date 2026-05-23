import { createTheme, ThemeProvider } from '@mui/material';
import type { FC } from 'react';
import ToolbarContainer from './components/toolbar/ToolbarContainer';

const Theme = createTheme({
	components: {
		MuiButton: {
			defaultProps: {
				variant: 'outlined',
			},
		},
	},
});

const ToolbarApp: FC = () => {
	return (
		<ThemeProvider theme={Theme}>
			<ToolbarContainer />
		</ThemeProvider>
	);
};

export default ToolbarApp;
