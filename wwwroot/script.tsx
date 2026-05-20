import ReactDOM from 'react-dom/client';
import { ToolbarContainer } from './scripts/ToolbarContainer';
import { ensureElementById } from './scripts/utils/dom';
// @ts-expect-error
import './style.css';
import { StrictMode } from 'react';

const toolbarContainerElement = ReactDOM.createRoot(
  ensureElementById('toolbar-container'),
);
toolbarContainerElement.render(
  <StrictMode>
    <ToolbarContainer />
  </StrictMode>,
);
