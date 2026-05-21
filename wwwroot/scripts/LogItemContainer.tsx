import type { FC } from 'react';
import LogItemElement from './components/log/LogItemElement';
import ModMessageElement from './components/log/ModMessageElement';
import type { LogItem, ModMessage } from './types/csharp';

export interface LogItemLogItemContainerProps {
  type: 'logItem';
  log: LogItem;
  color: string;
}

export interface LogItemModMessageContainerProps {
  type: 'mod';
  log: ModMessage;
  timestamp: Date;
}

export type LogItemContainerProps =
  | LogItemLogItemContainerProps
  | LogItemModMessageContainerProps;

const LogItemContainer: FC<LogItemContainerProps> = (props) => {
  if (props.type === 'logItem') {
    const { log, color } = props;
    return <LogItemElement log={log} color={color} />;
  } else {
    const { log, timestamp } = props;
    return <ModMessageElement log={log} timestamp={timestamp} />;
  }
};

export default LogItemContainer;
