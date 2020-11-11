import stripe from 'tipsi-stripe';

export default stripeConfig => {
  stripe.setOptions({
    publishableKey: stripeConfig.STRIPE_KEY,
    merchantId: stripeConfig.APPLE_MERCHANT,
    androidPayMode: stripeConfig.ANDROID_PAY_MODE,
  });
};
