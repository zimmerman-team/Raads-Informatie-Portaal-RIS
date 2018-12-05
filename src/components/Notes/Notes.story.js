// BASE
import React from 'react';
import { storiesOf } from '@storybook/react';

// ADDONS
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { viewport } from '@storybook/addon-viewport';
import { knobs } from '@storybook/addon-knobs';
import { events } from '@storybook/addon-events';
import { checkA11y } from '@storybook/addon-a11y';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createGenerateClassName, jssPreset } from 'material-ui-next/styles';
import Notes from './Notes';

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point');

// import MainMenu from '../components/MainMenu/MainMenu';

storiesOf('Component group', module)
  .addDecorator(checkA11y)
  .add('Notes', () => (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider>
        <Notes />
      </MuiThemeProvider>
    </JssProvider>
  ));
