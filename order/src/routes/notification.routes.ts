// import express from 'express';
// import { sendOrderStatusUpdate, subscribeToOrderUpdates } from '../messages/order.messages';

// const router = express.Router();

// router.post('/:id/status', async (req, res) => {
//     const { status } = req.body;
//     const orderId = req.params.id;

//     await sendOrderStatusUpdate(orderId, status);
//     res.status(200).json({ message: `Status update sent for order ${orderId}` });
// });

// router.post('/:id/subscribe', async (req, res) => {
//     const orderId = req.params.id;

//     await subscribeToOrderUpdates(orderId);
//     res.status(200).json({ message: `Subscribed to updates for order ${orderId}` });
// });

// export default router;
