import React, { useState } from "react";
import axios from "axios";
// MUI Components
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
// stripe
import {
  useStripe,
  useElements,
  CardElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
// Util imports
import { makeStyles } from "@material-ui/core/styles";
// Custom Components
import CardInput from "../cardInput/CardInput";

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    margin: "35vh auto",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
  },
  div: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },
  button: {
    margin: "2em auto 1em",
  },
});

function Home() {
  const classes = useStyles();
  // State
  const [email, setEmail] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmitPay = async (event) => {
    if (!stripe || !elements) {
      return;
    }

    const res = await axios.post("http://localhost:3001/pay", {
      email: email,
      price: 5000,
    });

    const clientSecret = res.data["client_secret"];

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("Money is in the bank!");
      }
    }
  };

  const handleSubmitSub = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        email: email,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      const res = await axios.post("http://localhost:3001/sub", {
        payment_method: result.paymentMethod.id,
        email: email,
      });

      const { client_secret, status } = res.data;
      console.log(res.data);

      if (status === "requires_action") {
        stripe.confirmCardPayment(client_secret).then(function (result) {
          if (result.error) {
            console.log("There was an issue!");
            console.log(result.error);
          } else {
            console.log("You got the money!");
          }
        });
      } else {
        console.log("You got the money!");
      }
    }
  };

  const cancelSub = async () => {
    const res = await axios.post("http://localhost:3001/cancel");
    console.log(res.data);
  };

  const dd = async () => {
    const res = await axios.post("http://localhost:3001/d");
    console.log(res.data);
  };

  const updateSub = async () => {
    const res = await axios.post("http://localhost:3001/updateSub");
    console.log(res.data);
  };

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Button onClick={dd}> DD </Button>
        <TextField
          label="Email"
          id="outlined-email-input"
          helperText={`Email you'll recive updates and receipts on`}
          margin="normal"
          variant="outlined"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <CardInput />
        <div className={classes.div}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleSubmitPay}
          >
            Pay
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleSubmitSub}
          >
            Subscription
          </Button>

          <Button variant="contained" color="primary" onClick={cancelSub}>
            Cancel
          </Button>

          <Button onClick={updateSub} variant="contained" color="primary">
            updateSub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Home;
