import type { FC } from 'react';
import EditButton from './EditButton';
import ResetButton from './ResetButton';

const SettingContainer: FC = () => {
  return (
    <>
      <EditButton />
      <ResetButton />
    </>
  );
};

export default SettingContainer;
