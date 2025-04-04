import { flag } from 'flags/next';

export const exampleFlag = flag({
  key: 'first-flag',
  defaultValue: true,
  decide() {
    return true;
  },
});
