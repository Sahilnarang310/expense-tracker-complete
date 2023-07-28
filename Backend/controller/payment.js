const Order = require ("../models/order");
const Razorpay = require("razorpay");
const jwt = require('jsonwebtoken')

function generateAccessToken(id, premium) {
	let x = jwt.sign({ userId: id, ispremium: premium }, "secretKey");
	return x;
}

const purchasePremium = async (req, res, next) => {
	try {
		var rzp = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_KEY_SECRET,
		});

		const amount = 300;

		rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
			if (err) {
				console.log(err);
				res.json({ message: err, success: false });
			}

			req.user
				.createOrder({ orderid: order.id, status: "PENDING" })
				.then(() => {
					return res.status(201).json({ order, key_id: rzp.key_id });
				})
				.catch((err) => {
					res.json({ message: err, success: false });
				});
	 	});
	} catch (error) {
		console.log(error);
		res.status(401).json({ message: error, success: false });
	}
};

const updateTransactionStatus = async (req, res, next) => {
	try {
		const { payment_id, order_id } = req.body;
		const userId = req.user.id;
		const order = await Order.findOne({ where: { orderid: order_id } });
		const promise1 = order.update({ paymentid: payment_id, status: "successfull" });
		const promise2 = req.user.update({ ispremiumuser: true });
		await Promise.all([promise1, promise2]);
		return res.status(202).json({ success: true, message: "transaction successful" ,token:generateAccessToken(userId,true)});
	} catch (error) {
		console.log(error);
		res.json({ message: error, success: false });
	}
};

const updateTransactionStatusFailed = async (req, res, next) => {
	try {
		const { payment_id, order_id } = req.body;
		const order = await Order.findOne({ where: { orderid: order_id } });
		await order.update({ paymentid: payment_id, status: "failed" });
		return res.status(202).json({ success: true, message: "updated successfully" });
	} catch (error) {
		console.log(error);
		res.json({ message: error, success: false });
	}
};

module.exports = { purchasePremium, updateTransactionStatus, updateTransactionStatusFailed };



// const Order = require("../models/order");
// const Razorpay = require("razorpay");
// const jwt = require('jsonwebtoken');

// function generateAccessToken(id, premium) {
//   const token = jwt.sign({ userId: id, ispremium: premium }, "secretKey");
//   return token;
// }

// const purchasePremium = async (req, res, next) => {
//   try {
//     const rzp_test_BzbMKwEdzNJ64U = "your_rzp_test_BzbMKwEdzNJ64U_value";
//     const slrnwlWsw9WRNc8ligt6mmE9 = "your_slrnwlWsw9WRNc8ligt6mmE9_value";
    
//     var rzp = new Razorpay({
//       key_id: rzp_test_BzbMKwEdzNJ64U,
//       key_secret: slrnwlWsw9WRNc8ligt6mmE9,
//     });

//     const amount = 300;

//     rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Error creating order", success: false });
//       }

//       req.user.createOrder({ orderid: order.id, status: "PENDING" })
//         .then(() => {
//           return res.status(201).json({ order, key_id: rzp.key_id });
//         })
//         .catch((err) => {
//           console.log(err);
//           return res.status(500).json({ message: "Error creating order", success: false });
//         });
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal server error", success: false });
//   }
// };

// const updateTransactionStatus = async (req, res, next) => {
//   try {
//     const { payment_id, order_id } = req.body;
//     const userId = req.user.id;
//     const order = await Order.findOne({ where: { orderid: order_id } });
//     await order.update({ paymentid: payment_id, status: "successfull" });
//     await req.user.update({ ispremiumuser: true });
//     const token = generateAccessToken(userId, true);
//     return res.status(202).json({ success: true, message: "Transaction successful", token });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal server error", success: false });
//   }
// };

// const updateTransactionStatusFailed = async (req, res, next) => {
//   try {
//     const { payment_id, order_id } = req.body;
//     const order = await Order.findOne({ where: { orderid: order_id } });
//     await order.update({ paymentid: payment_id, status: "failed" });
//     return res.status(202).json({ success: true, message: "Updated successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal server error", success: false });
//   }
// };

// module.exports = { purchasePremium, updateTransactionStatus, updateTransactionStatusFailed };
