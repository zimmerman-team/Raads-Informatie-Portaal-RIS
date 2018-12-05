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
import PageHeader from './PageHeader';

storiesOf('Page Components', module)
  .addDecorator(checkA11y)
  .add('Page Header', () => (
    <PageHeader title="Lorem ipsum header" description="Lorem ipsum dolor simet empty" icon="A" />
  ));
