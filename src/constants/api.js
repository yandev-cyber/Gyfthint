import isProduction from './environment';

const apiConstants = {
  userExistence: '/user',
  pushNotification: '/push-notification',
  payment: '/payment',
  card: '/card',
};

export default isProduction
  ? {
      baseUrl:
        'https://us-central1-gyfthint-production.cloudfunctions.net/gyfthint',
      deepLinkPrefix: 'gyfthintproduction.page.link',
      dashboardDeeplink: 'https://gyfthintproduction.page.link/rTCx',
      ...apiConstants,
    }
  : {
      baseUrl: 'https://us-central1-gyfthint-d82f5.cloudfunctions.net/gyfthint',
      deepLinkPrefix: 'gyfthintdev.page.link',
      dashboardDeeplink: 'https://gyfthintdev.page.link/Foyc',
      ...apiConstants,
    };
