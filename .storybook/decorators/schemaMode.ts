import type { VueRenderer } from '@storybook/vue3';
import type { DecoratorFunction } from 'storybook/internal/types';

const backgrounds = {
  dark: '#0E141B',
  light: '#F5F7FA',
};

const color = {
  dark: '#e0e8f2',
  light: '#293b50',
};

export const schema = {
  description: 'Theme',
  defaultValue: 'light',
  toolbar: {
    title: 'Theme',
    items: [
      { title: 'Light', value: 'light', icon: 'sun' },
      { title: 'Dark', value: 'dark', icon: 'moon' },
    ],
    dynamicTitle: true,
  },
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const schemaMode: DecoratorFunction<VueRenderer, { [x: string]: any }> = function (story, context) {
  document.documentElement.setAttribute('data-theme', context.globals.schema);

  document.querySelectorAll<HTMLBodyElement>('[data-story-block]').forEach((item) => {
    item.style.backgroundColor = backgrounds[context.globals.schema];
    item.style.color = color[context.globals.schema];
  });

  document.querySelectorAll<HTMLDivElement>('.docs-story').forEach((item) => {
    item.style.backgroundColor = backgrounds[context.globals.schema];
    item.style.color = color[context.globals.schema];
  });

  return {
    components: { story },
    template: '<story />',
  };
};
