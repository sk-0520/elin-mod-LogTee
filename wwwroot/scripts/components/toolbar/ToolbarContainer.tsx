import { Grid } from '@mui/material';
import { type FC, useEffect } from 'react';
import { useLanguageStore } from '../../hooks/useLanguageStore';
import { ensureElementById } from '../../utils/dom';
import { getBrowserLanguage, getLanguage } from '../../utils/language';
import { getQuery } from '../../utils/query';
import Busy from '../busy/Busy';
import ErrorDialog from '../error/ErrorDialog';
import ActionContainer from './action/ActionContainer';
import LogFileContainer from './log-file/LogFileContainer';
import StreamContainer from './stream/StreamContainer';
import ToolbarGroup from './ToolbarGroup';

export const ToolbarContainer: FC = () => {
	const setLanguage = useLanguageStore((a) => a.setLanguage);
	const language = useLanguageStore((a) => a.language);

	// biome-ignore lint/correctness/useExhaustiveDependencies: 初回実行
	useEffect(() => {
		const query = getQuery(location.search);
		const gameLanguage = query.get('lang') ?? undefined;
		const language = getLanguage(gameLanguage);
		setLanguage(language);
		const browserLanguage = getBrowserLanguage(gameLanguage);
		document.documentElement.lang = browserLanguage;

		setTimeout(() => {
			// いろいろあきらめ！
			const target = query.get('target');
			if (target === 'socket') {
				ensureElementById('stream-socket-command').click();
			} else if (target === 'file') {
				ensureElementById('stream-file-command').click();
			}
		}, 1_000);
	}, []);

	return (
		<Grid
			container
			direction="row"
			sx={{
				justifyContent: 'flex-start',
				alignItems: 'stretch',
			}}
		>
			<ToolbarGroup title={language['stream.title']}>
				<StreamContainer />
			</ToolbarGroup>
			<ToolbarGroup title={language['log-file.title']}>
				<LogFileContainer />
			</ToolbarGroup>
			<ToolbarGroup title={language['action.title']}>
				<ActionContainer />
			</ToolbarGroup>
			{/* TODO: このあたりの処理しらんわ, とりあえず動く処理にしたうえで対応策は調べて実装する */}
			<ErrorDialog />
			<Busy />
		</Grid>
	);
};

export default ToolbarContainer;
