import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { JsonEditor } from 'json-edit-react';
import type { FC } from 'react';
import { useLanguageStore } from '../../stores/useLanguageStore';
import type { ModMessage } from '../../types/csharp';

export interface ModMessageElementProps {
  log: ModMessage;
  timestamp: Date;
}

const ModMessageElement: FC<ModMessageElementProps> = (props) => {
  const { log, timestamp } = props;
  const getText = useLanguageStore((a) => a.getText);

  return (
    <Accordion>
      <AccordionSummary>
        <Typography>
          {timestamp.toLocaleString()} {getText(log.messageId)}
        </Typography>
      </AccordionSummary>
      {log.details && (
        <AccordionDetails>
          <JsonEditor viewOnly={true} data={log.details} />
        </AccordionDetails>
      )}
    </Accordion>
  );
};

export default ModMessageElement;
