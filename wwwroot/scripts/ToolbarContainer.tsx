import type { FC } from 'react';
import ActionContainer from './components/toolbar/action/ActionContainer';
import LogFileContainer from './components/toolbar/log-file/LogFileContainer';
import ModeContainer from './components/toolbar/mode/ModeContainer';
import SettingContainer from './components/toolbar/setting/SettingContainer';
import StreamContainer from './components/toolbar/stream/StreamContainer';
import ToolbarGroup from './components/toolbar/ToolbarGroup';
import { useLanguageStore } from './stores/useLanguageStore';

export const ToolbarContainer: FC = () => {
  const getText = useLanguageStore((state) => state.getText); // for re-render when language changes

  return (
    <>
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
    </>
  );
};

export default ToolbarContainer;
