import { Grid } from '@mui/material';
import { type FC, useEffect } from 'react';
import Busy from './components/busy/Busy';
import ErrorDialog from './components/error/ErrorDialog';
import ActionContainer from './components/toolbar/action/ActionContainer';
import LogFileContainer from './components/toolbar/log-file/LogFileContainer';
import ModeContainer from './components/toolbar/mode/ModeContainer';
import SettingContainer from './components/toolbar/setting/SettingContainer';
import StreamContainer from './components/toolbar/stream/StreamContainer';
import ToolbarGroup from './components/toolbar/ToolbarGroup';
import { useLanguageStore } from './stores/useLanguageStore';
import { getLanguage } from './utils/language';
import { getQuery } from './utils/query';

export const ToolbarContainer: FC = () => {
  const setLanguage = useLanguageStore((a) => a.setLanguage); // for re-render when language changes
  const getText = useLanguageStore((a) => a.getText); // for re-render when language changes

  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回実行
  useEffect(() => {
    const query = getQuery(location.search);
    const lang = getLanguage(query.get('lang') ?? undefined);
    setLanguage(lang);
  }, []);

  return (
    <Grid
      container
      direction="row"
      sx={{
        justifyContent: 'space-around',
        alignItems: 'stretch',
      }}
    >
      <ToolbarGroup title={getText('mode.title')}>
        <ModeContainer />
      </ToolbarGroup>
      <ToolbarGroup title={getText('stream.title')}>
        <StreamContainer />
      </ToolbarGroup>
      <ToolbarGroup title={getText('log-file.title')}>
        <LogFileContainer />
      </ToolbarGroup>
      <ToolbarGroup title={getText('action.title')}>
        <ActionContainer />
      </ToolbarGroup>
      <ToolbarGroup title={getText('setting.title')}>
        <SettingContainer />
      </ToolbarGroup>
      {/* TODO: このあたりの処理しらんわ, とりあえず動く処理にしたうえで対応策は調べて実装する */}
      <ErrorDialog />
      <Busy />
    </Grid>
  );
};

export default ToolbarContainer;
