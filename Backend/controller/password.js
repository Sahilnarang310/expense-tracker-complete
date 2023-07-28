const nodemailer = require("nodemailer");
const forgotpassword = require("../models/passwordReq");
const { v4: uuidv4 } = require("uuid");
const { UUIDV4 } = require("sequelize");
const User = require("../models/user");
const passwordReq = require("../models/passwordReq");
const bcrypt = require("bcrypt");

const forgotPassword = async (req, res, next) => {
	const { email } = req.body;

	const user = await User.findOne({ where: { email: email } });
	let newid = uuidv4();
	if (user) {
		let obj = {
			id: newid,
			active: true,
			userId: user.id,
		};
		await forgotpassword.create(obj);
	} else {
		return res.status(500).json({ message: "No account registered with this email", sucess: false });
	}

	const transporter = await nodemailer.createTransport({
		host: "smtp-relay.sendinblue.com",
		port: 587,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		},
		tls: {
			ciphers: "SSLv3",
		},
	});

	const mailOptions = {
		from: "softwaredev310@gmail.com",
		to: email,
		subject: "Donty worry we will help you get a new password",
		text: "hey qt",
		html: `<a href="http://localhost:3000/password/resetpassword/${newid}">click here to reset your password</a>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			res.status(500).json({ message: `cannot send email `, success: false });
		} else {
			res.status(200).json({ message: `email sent successfully`, success: false });
		}
	});
};

async function resetpassword(req, res, next) {
	const { id } = req.params;

	let user = await passwordReq.findOne({ where: { id: id } });

	if (user) {
		user.update({ active: false });
		res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
		res.end();
	}
}

const updatepassword = async (req, res) => {
	try {
		const { newpassword } = req.query;
		const { id } = req.params;

		let find = await passwordReq.findOne({ where: { id: id } });

		if (find) {
			let user = await User.findOne({ where: { id: find.userId } });
			if (user) {
				let salt = await bcrypt.genSalt(10);
				let hashedPassword = await bcrypt.hash(newpassword, salt);

				await User.update({ password: hashedPassword }, { where: { id: user.id } });

				res.status(201).json({ message: "Successfuly update the new password" });
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(404).json({ error: "no user exists", success: false });
	}
};

module.exports = { forgotPassword, resetpassword, updatepassword };






// const bcrypt = require('bcrypt');

// const User = require('../models/user');
// const Forgotpassword = require('../models/passwordReq');

// const uuid = require('uuid');
// const Sib = require('sib-api-v3-sdk');
// const validator = require('validator');

// require('dotenv').config();

// const forgotpassword = async (req, res) => {
//     try {

//         const client = Sib.ApiClient.instance;
//         const apiKey = client.authentications['api_key'];
//         apiKey.apiKey = process.env.API_KEY;
//         const transEmailApi = new Sib.TransactionalEmailsApi();
        
//         const { email } =  req.body;
//         const user = await User.findOne({where : { email }});
//         if(user){  
//             const id = uuid.v4();
//             user.createForgotpassword({ id , isActive: true })

//             if (!validator.isEmail(email.toLowerCase())) {
//                     return res.status(400).json({ error: 'Invalid email address' });
//             }
             
//             const sender = {email:'softwaredev310.com'};
//             const receiver =  [{email:'narang310@gmail.com'} ];

//             const msg = {
//                 sender,
//                 to: receiver,
//                 subject: 'Password reset request for your account',
//                 textContent: 'We received a request to reset the password for your account. Please click on the link to reset the password',
//                 htmlContent: `<p>Hello,</p>
//                 <p>We received a request to reset the password for your account. Please follow the link below to reset your password:</p>
//                 <p><a href="http://localhost:4000/password/resetpassword/${id}">Reset Password</a></p><p>If you did not request this password reset, please ignore this email and contact us immediately.</p><p>Thank you,
//                 </p><p>Expensify</p>`
//             }
 
//             const response = await transEmailApi.sendTransacEmail(msg)
//             .then((response) => {
//                 return res.status(202).json({message: 'Link to reset password sent to your mail ', success: true});
//             })
//             .catch((error) => {
//                 console.log(error)
//                 throw new Error(error);
//             })
//         }else {
//             throw new Error(`User doesn't exist`)
//         }
//     } catch(err){
//         console.error(err)
//         return res.json({ message: err, success: false });
//     }
// }

// const resetpassword = (req, res) => {
//     const id =  req.params.id;
//     Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
//         if(forgotpasswordrequest){
//             forgotpasswordrequest.update({ isActive: false});
//             res.status(200).send(`<html>
//                                     <script>
//                                         function formsubmitted(e){
//                                             e.preventDefault();
//                                             console.log('called')
//                                         }
//                                     </script>

//                                     <form action="/password/updatepassword/${id}" method="get">
//                                         <label for="newpassword">Enter New password</label>
//                                         <input name="newpassword" type="password" required></input>
//                                         <button>reset password</button>
//                                     </form>
//                                 </html>`
//                                 )
//             res.end()
//         }
//     })
// }

// const updatepassword = (req, res) => {

//     try {
//         const { newpassword } = req.query;
//         const { resetpasswordid } = req.params;
//         Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
//             User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
//                 if(user) {
//                     //encrypt the password
//                     const saltRounds = 10;
//                     bcrypt.genSalt(saltRounds, function(err, salt) {
//                         if(err){
//                             console.log(err);
//                             throw new Error(err);
//                         }
//                         bcrypt.hash(newpassword, salt, function(err, hash) {
//                             // Store hash in your password DB.
//                             if(err){
//                                 console.log(err);
//                                 throw new Error(err);
//                             }
//                             user.update({ password: hash }).then(() => {
//                                 res.status(201).json({message: 'Successfuly update the new password'})
//                             })
//                         });
//                     });
//             } else{
//                 return res.status(404).json({ error: 'No user Exists', success: false})
//             }
//             })
//         })
//     } catch(error){
//         return res.status(403).json({ error, success: false } )
//     }
// }

// module.exports = {
//     forgotpassword,
//     updatepassword,
//     resetpassword
// }
