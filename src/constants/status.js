export default {
  hint: {
    IN_INVENTORY: 1,
    UPDATED_INVENTORY: 2,
    PURCHASED: 3,
    DECLINED: 4,
    DELETED: 5,
  },
  order: {
    PURCHASED: 3,
    SHIPPED: 4,
    ON_HOLD: 5,
    CANCELED: 6,
  },
  notification: {
    REQUEST: 1,
    ACKNOWLEDGE: 2,
  },
  hintType: {
    SNAP: 'snap',
    WEB: 'web',
    SCAN: 'scan',
  },
  webForm: {
    NAME: 1,
    PRICE: 2,
    COLOR: 3,
    SIZE: 4,
  },
};
