import { addDecorator, configure } from '@storybook/react';

import ThemeDecorator from './theme-decorator';

addDecorator(ThemeDecorator);

const loadStories = () => [require.context('../src', true, /stories\.tsx$/)];

configure(loadStories(), module);
