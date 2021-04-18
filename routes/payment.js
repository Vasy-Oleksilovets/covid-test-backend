// @ts-nocheck
const express = require('express');
const router = express.Router();
const authVerify = require('../middleware/authVerify');

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51HorBMCQmjVUxLPeAtFlDSN1mwwMDQAPoJz5Vxj5321eIZY1F6JCWPivm4xrlYUSl4PBvojg4G6ZEkOkYIFT9sL100KEeG5h8V')

router.get('/secret', authVerify, async(req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 125,
      currency: 'usd',
      metadata: {integration_check: 'accept_a_payment'},
    });
    return res.status(200).json({client_secret: paymentIntent.client_secret});
  }
  catch {
    return res.status(500).json({error: 'There is an error in server side'});
  }
})

module.exports = router;