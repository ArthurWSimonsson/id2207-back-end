require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());

app.use(express.json());

const User = require("./model/user");
const InitialRequest = require("./model/initialRequest")

const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome");
});


// Register
app.post("/register", async (req, res) => {
    try {
        // Get user input
        const { role, password } = req.body;
        console.log("role", role);
    
        // Validate user input
        if (!(role && password)) {
          res.status(400).send("All input is required");
        }

        const oldUser = await User.findOne({ role });

        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await User.create({
          role,
          password: encryptedPassword,
        });
    
        // Create token
        const token = jwt.sign(
          { user_id: user._id, role },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;
    
        // return new user
        res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
      // Our register logic ends here
});

app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { role, password } = req.body;
  
      // Validate user input
      if (!(role && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ role });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, role },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      else {
          res.status(400).send("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/initialRequest", auth, async (req, res) => {
        try {
            const {recordNumber, clientName, eventType, attendees,
                 budget, decorations, parties, photos, food, drinks} = req.body;
            console.log(req.body);
            res.status(200).json()
    
        }
        catch (err) {
            console.log(err);
      }
  })

module.exports = app;