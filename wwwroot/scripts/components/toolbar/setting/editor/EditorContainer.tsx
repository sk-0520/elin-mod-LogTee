import {
  Box,
  Button,
  Checkbox,
  type CheckboxProps,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  TextField,
  type TextFieldProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import postSetting from '../../../../api/postSetting';
import { useLanguageStore } from '../../../../stores/useLanguageStore';
import type { Setting } from '../../../../types/csharp';
import EditorGroup from './EditorGroup';

const StyledTextField = styled((props: TextFieldProps) => (
  <TextField size="small" {...props} />
))((_) => ({}));

const StyledNumberTextField = styled((props: TextFieldProps) => (
  <StyledTextField type="number" {...props} />
))((_) => ({
  input: {
    textAlign: 'right',
  },
}));

const StyledCheckbox = styled((props: CheckboxProps) => (
  <Checkbox size="small" {...props} />
))((_) => ({
  padding: '4px',
}));

export interface EditorContainerProps {
  setting: Setting;
  onCancel: () => void;
}

const EditorContainer: FC<EditorContainerProps> = (props) => {
  const { setting, onCancel } = props;
  const getText = useLanguageStore((a) => a.getText);
  const { control, handleSubmit } = useForm<Setting>({
    defaultValues: setting,
  });

  const onSubmit = async (data: Setting) => {
    console.log(data);
    try {
      await postSetting(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <DialogTitle>{getText('setting.editor.title')}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <Box>
            <Container>
              <EditorGroup title={getText('setting.editor.logBuffer.title')}>
                <Controller
                  name="logBuffer.capacity"
                  control={control}
                  render={({ field }) => (
                    <StyledNumberTextField
                      label={getText('setting.editor.logBuffer.capacity')}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="logBuffer.logFlushLimit"
                  control={control}
                  render={({ field }) => (
                    <StyledNumberTextField
                      label={getText('setting.editor.logBuffer.logFlushLimit')}
                      {...field}
                    />
                  )}
                />
              </EditorGroup>

              <EditorGroup title={getText('setting.editor.logFile.title')}>
                <Controller
                  name="logFile.isEnabled"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <StyledCheckbox checked={field.value} {...field} />
                      }
                      label={getText('setting.editor.logFile.isEnabled')}
                    />
                  )}
                />

                <Controller
                  name="logFile.filePath"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      label={getText('setting.editor.logFile.filePath')}
                      {...field}
                    />
                  )}
                />
              </EditorGroup>

              <EditorGroup title={getText('setting.editor.socketServer.title')}>
                <Controller
                  name="socketServer.isEnabled"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <StyledCheckbox checked={field.value} {...field} />
                      }
                      label={getText('setting.editor.socketServer.isEnabled')}
                    />
                  )}
                />
                <Controller
                  name="socketServer.port"
                  control={control}
                  render={({ field }) => (
                    <StyledNumberTextField
                      label={getText('setting.editor.socketServer.port')}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="socketServer.capacity"
                  control={control}
                  render={({ field }) => (
                    <StyledNumberTextField
                      label={getText('setting.editor.socketServer.capacity')}
                      {...field}
                    />
                  )}
                />
              </EditorGroup>

              <EditorGroup title={getText('setting.editor.socketClient.title')}>
                <Controller
                  name="socketClient.isEnabled"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <StyledCheckbox checked={field.value} {...field} />
                      }
                      label={getText('setting.editor.socketClient.isEnabled')}
                    />
                  )}
                />

                <Controller
                  name="socketClient.port"
                  control={control}
                  render={({ field }) => (
                    <StyledNumberTextField
                      label={getText('setting.editor.socketClient.port')}
                      {...field}
                    />
                  )}
                />
              </EditorGroup>

              <EditorGroup title={getText('setting.editor.webServer.title')}>
                <Controller
                  name="webServer.isEnabled"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <StyledCheckbox checked={field.value} {...field} />
                      }
                      label={getText('setting.editor.webServer.isEnabled')}
                    />
                  )}
                />
                <Controller
                  name="webServer.port"
                  control={control}
                  render={({ field }) => (
                    <StyledNumberTextField
                      label={getText('setting.editor.webServer.port')}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="webServer.openBrowserOnStartup"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <StyledCheckbox checked={field.value} {...field} />
                      }
                      label={getText(
                        'setting.editor.webServer.openBrowserOnStartup',
                      )}
                    />
                  )}
                />
              </EditorGroup>

              <EditorGroup title={getText('setting.editor.frontend.title')}>
                <Controller
                  name="frontend.cssFontFamily"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      label={getText('setting.editor.frontend.cssFontFamily')}
                      fullWidth
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="frontend.cssFontSize"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      label={getText('setting.editor.frontend.cssFontSize')}
                      {...field}
                    />
                  )}
                />
              </EditorGroup>
              {/* <pre>{JSON.stringify(setting, null, 2)}</pre> */}
            </Container>
          </Box>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Box>
          <Button onClick={handleSubmit(onSubmit)}>
            {getText('setting.editor.save')}
          </Button>
          <Button onClick={onCancel}>{getText('setting.editor.cancel')}</Button>
        </Box>
      </DialogActions>
    </>
  );
};

export default EditorContainer;
