import { configure } from '@storybook/react';

function loadStories() {
  require('./Formit.js');
}

configure(loadStories, module);
