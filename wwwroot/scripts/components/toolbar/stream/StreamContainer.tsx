import type { FC } from 'react';
import FileButton from './FileButton';
import SocketButton from './SocketButton';
import StopButton from './StopButton';

const StreamContainer: FC = () => {
  return (
    <>
      <SocketButton />
      <FileButton />
      <StopButton />
    </>
  );
};

export default StreamContainer;
