import { configure } from '@storybook/react';

function loadStories() {
  // require('../src/components/PageHeader/PageHeader.story');
  // require('../src/components/MobileMenu/MobileMenu.story');
  // require('../src/components/Notes/Notes.story');
  // require('../src/components/TopBar/TopBar.story');
  require('../src/components/Cards/BaseCard/BaseCard.story');
}

configure(loadStories, module);
