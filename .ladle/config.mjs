/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: 'src/**/*.stories.tsx',
  addons: {
    theme: { enabled: true, defaultState: 'light' },
    width: { enabled: true, options: { phone: 390, tablet: 768, laptop: 1024, desktop: 1440 }, defaultState: 0 },
  },
};
