import type { FC } from 'react';
import type { LogItem, ModMessage } from './types/csharp';

export interface LogItemContainerProps {
  log: LogItem | ModMessage;
}

const LogItemContainer: FC<LogItemContainerProps> = (props) => {
  const { log } = props;
  return <pre>{JSON.stringify(log, null, 2)}</pre>;
};

export default LogItemContainer;
