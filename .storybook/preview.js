import React from 'react';
import {addParameters, addDecorator} from '@storybook/react';
import DefaultThemeColors from '@shopify/polaris-tokens/dist-modern/theme/base.json';

import {AppProvider} from '../src';
import enTranslations from '../locales/en.json';

export const parameters = {
  actions: {argTypesRegex: '^on.*'},
  percy: {
    skip: true,
    widths: [375, 1280],
  },
};

export const decorators = [StrictModeDecorator, AppProviderDecorator];

export const globalTypes = {
  strictMode: {
    name: 'Strict mode',
    defaultValue: false,
    toolbar: {
      items: [
        {title: 'Disabled', value: false},
        {title: 'Enabled', value: true},
      ],
    },
  },
  designLanguage: {
    name: 'New Design Language',
    description: 'New DL',
    defaultValue: 'off',
    toolbar: {
      items: [
        {title: 'Disabled', value: 'off'},
        {title: 'Enabled - Light Mode', value: 'light'},
        {title: 'Enabled - Dark Mode', value: 'dark'},
      ],
    },
  },
};

function StrictModeDecorator(Story, context) {
  const Wrapper = context.globals.strictMode
    ? React.StrictMode
    : React.Fragment;

  return (
    <Wrapper>
      <Story {...context} />
    </Wrapper>
  );
}

function AppProviderDecorator(Story, context) {
  const dlConfig = {
    off: {newDesignLanguage: false},
    light: {newDesignLanguage: true, colorScheme: 'light'},
    dark: {newDesignLanguage: true, colorScheme: 'dark'},
  }[context.globals.designLanguage];

  if (context.args.omitAppProvider) return <Story {...context} />;

  // const colors = Object.entries(DefaultThemeColors).reduce(
  //   (accumulator, [key, value]) => ({
  //     ...accumulator,
  //     [key]: strToHex(color(key, value, 'Theme')),
  //   }),
  //   {},
  // );

  return (
    <AppProvider
      i18n={enTranslations}
      features={{newDesignLanguage: dlConfig.newDesignLanguage}}
      theme={{
        //   colors,
        colorScheme: dlConfig.colorScheme,
      }}
    >
      <Story {...context} />
    </AppProvider>
  );
}

function strToHex(str) {
  if (str.charAt(0) === '#') return str;

  return `#${str
    .slice(5, -1)
    .split(',')
    .slice(0, 3)
    .map(Number)
    .map((n) => n.toString(16))
    .map((n) => n.padStart(2, '0'))
    .join('')}`;
}
