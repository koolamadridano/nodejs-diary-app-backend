  
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { validationResult, check } = require('express-validator')

const User = require('../models/User');

//@ROUTE        * api/users
//@DESCRIPTION  * Register a user
//@ACCESS       * Public
router.post('/', [
    check('email', 'Please input a valid email') .isEmail(),
    check('password', 'Password must be 6-30 characters long') .isLength({  min: 6,  max: 30  })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
           return res
            .status(400)
            .send(errors.array());
        }

        const { name, email, password } = req.body;
        
        // check if user exists
        let user = await User.findOne({ email });
        if(user) {
            return res
                .status(406)
                .send("Email already exist, Try signing in.")
        }

        user = new User({
            name,
            email,
            password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Return & save
        await user.save();
        const payload = {
            user: {  id: user.id }
        }

        jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 }, (err, token) => {
            if(err) {
                return res
                    .status(400)
                    .send("Something went wrong"); 
            }
            return res
                .status(200)
                .send(token);
        })    
  
    } catch(err) {
        return res 
            .status(500)
            .send("Something went wrong.")
    }
    
   
})

module.exports = router;
