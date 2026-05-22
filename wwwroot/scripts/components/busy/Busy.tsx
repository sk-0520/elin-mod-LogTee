import { CircularProgress, Modal } from '@mui/material';
import type { FC } from 'react';
import { useBusyStore } from '../../stores/useBusyStore';

const Busy: FC = () => {
  const isBusy = useBusyStore((a) => a.isBusy);

  return (
    <Modal
      open={isBusy}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Modal>
  );
};

export default Busy;
