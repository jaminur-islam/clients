import React from "react";
// Components
import Home from "./components/Home/Home";
// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// Styles

const stripePromise = loadStripe(
  "pk_test_51Jw3v5HGCqyVSIesYhIzHWnHugLlIg7uQUKd5houUAjo1igK2kioeLp32wnqcTw0SF2Q5DalOuo5MrOgy9mJVZdY008VOOTk8N"
);

console.log(stripePromise);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Home />
    </Elements>
  );
}

export default App;
