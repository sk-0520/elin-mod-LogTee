import { createTheme, ThemeProvider } from '@mui/material';
import type { FC } from 'react';
import ToolbarContainer from './components/toolbar/ToolbarContainer';

const Theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#704a1f',
		},
	},
	typography: {
		button: {
			textTransform: 'none',
		},
	},
	components: {
		MuiButton: {
			defaultProps: {
				variant: 'outlined',
				sx: {
					color: '#704a1f',
					borderColor: '#b29f77',
				},
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
