import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { JsonEditor } from 'json-edit-react';
import type { FC } from 'react';
import { useErrorNotifyStore } from '../../stores/useErrorNotifyStore';
import { useLanguageStore } from '../../stores/useLanguageStore';

const ErrorDialog: FC = () => {
  const errorNotifyStore = useErrorNotifyStore();
  const getText = useLanguageStore((a) => a.getText);

  const handleClose = () => {
    errorNotifyStore.clearError();
  };

  return (
    <Dialog open={errorNotifyStore.hasError} onClose={handleClose}>
      <DialogTitle>{getText('error-dialog.title')}</DialogTitle>
      <DialogContent>
        <Typography>{errorNotifyStore.message}</Typography>
        {errorNotifyStore.details && (
          <JsonEditor viewOnly={true} data={errorNotifyStore.details} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{getText('error-dialog.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
