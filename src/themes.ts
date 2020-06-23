import closeBlack from './icons/close-black-24dp.svg';
import closeWhite from './icons/close-white-24dp.svg';
import menuBlack from './icons/menu-black-24dp.svg';
import menuWhite from './icons/menu-white-24dp.svg';
import refreshBlack from './icons/refresh-black-24dp.svg';
import refreshWhite from './icons/refresh-white-24dp.svg';

export type Theme = {
  name: string;
  styles: { [key: string]: string };
  icons: { [key: string]: string };
};

export let themes: Theme[] = [
  {
    name: 'light',
    styles: {
      background: '#fff',
      primary: '#219be5',
      textPrimary: '#000',
      textSecondary: '#333',
      badgeBackgroundValid: '#219be5',
      badgeColorValid: '#fff',
      badgeFontWeight: '500',
      gridBorderColor: '#777',
      targetBackground: '#ebf7fd',
      targetBorderColor: '#bbb',
      shadowOpacity: '0.25',
    },
    icons: {
      close: closeBlack,
      menu: menuBlack,
      refresh: refreshBlack,
    },
  },
  {
    name: 'dark',
    styles: {
      background: '#212121',
      primary: '#219be5',
      textPrimary: '#efefef',
      textSecondary: '#efefef',
      badgeBackgroundValid: '#219be5',
      badgeColorValid: '#efefef',
      badgeFontWeight: '700',
      gridBorderColor: '#777',
      targetBackground: 'inherit',
      targetBorderColor: '#bbb',
      shadowOpacity: '0.5',
    },
    icons: {
      close: closeWhite,
      menu: menuWhite,
      refresh: refreshWhite,
    },
  },
];
