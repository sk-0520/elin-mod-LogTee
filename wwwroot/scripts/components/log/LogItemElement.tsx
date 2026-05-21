import { Typography } from '@mui/material';
import type { FC } from 'react';
import type { LogItem } from '../../types/csharp';
import ModMessageElement from './ModMessageElement';

export interface LogItemElementProps {
  log: LogItem;
  color: string;
}

const LogItemElement: FC<LogItemElementProps> = (props) => {
  const { log, color } = props;

  if (log.message.kind === 'Mod') {
    if (log.message.mod) {
      return (
        <ModMessageElement log={log.message.mod} timestamp={log.logTimestamp} />
      );
    }
    return (
      <ModMessageElement
        log={{
          kind: 'Warning',
          messageId: 'mod.message.id.unknown-error',
          details: undefined,
        }}
        timestamp={log.logTimestamp}
      />
    );
  }

  return (
    <Typography component="span" sx={{ color: color, marginRight: '0.25ch' }}>
      {log.message.message}
    </Typography>
  );
};

export default LogItemElement;
