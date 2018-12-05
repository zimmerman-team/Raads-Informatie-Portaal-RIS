// BASE
import React from 'react';
import { storiesOf } from '@storybook/react';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProviderNext from 'material-ui-next/styles/MuiThemeProvider';
// ADDONS
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { viewport } from '@storybook/addon-viewport';
import { knobs } from '@storybook/addon-knobs';
import { events } from '@storybook/addon-events';
import { checkA11y } from '@storybook/addon-a11y';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from 'material-ui-next/styles';
import BaseCard from './BaseCard';

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point');


const AppbarStyles = () => getMuiTheme({
  palette: {
    primary1Color: '#f4511e'
  }
});

storiesOf('Cards', module)
  .addDecorator(checkA11y)
  .add('BaseCard', () => (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProviderNext muiTheme={AppbarStyles()}>
      <BaseCard />
      </MuiThemeProviderNext>
    </JssProvider>
  ));
