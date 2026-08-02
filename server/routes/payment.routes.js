import { Router } from "express";
import { allPayments, buySubscribtion, cancelSubscription, getRazorpayKey, razorpayWebhook, verifySubscription } from "../controllers/payment.controller.js";
import {isLoggedIn,authorizedRoles} from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/webhook').post(razorpayWebhook);

router.route('/razorpay-key')
    .get(
        isLoggedIn,
        getRazorpayKey
    )

router.route('/subscribe')
    .post(
        isLoggedIn,
        buySubscribtion
    )

router.route('/verify')
    .post(
        isLoggedIn,
        verifySubscription
    )

router.route('/unsubscribe')
    .post(
        isLoggedIn,
        cancelSubscription
    )

router.route('/')
    .get(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        allPayments
    )


export default router;