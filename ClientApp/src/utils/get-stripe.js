import { loadStripe } from '@stripe/stripe-js';

let stripePromise = null;

const getStripe = () => {
  if (!stripePromise) {
    // console.log(process.env.REACT_APP_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    stripePromise = loadStripe("pk_test_51IV9euJ3fcy584VlpS1BaLM6TJXGRW62XJLXoTHE3wiSEkKLCxA6hQo89qyumLviqdc0rvueFlvAsV0Zc4mBCxqE00uEpVRVYA");
  }
  return stripePromise;
};

export default getStripe;