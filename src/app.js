require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var ObjectID = require('mongodb').ObjectID;

const app = express();

app.use(cors());

app.use(express.json());

const User = require("./model/user");
const InitialRequest = require("./model/initialRequest");
const Task = require("./model/task");
const RecruitmentRequest = require("./model/recruitmentRequest");
const FinancialRequest = require("./model/financialRequest");

const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome");
});


app.post("/register", async (req, res) => {
    try {
        const { role, password } = req.body;
        console.log("role", role);
    
        if (!(role && password)) {
          res.status(400).send("All input is required");
        }

        const oldUser = await User.findOne({ role });

        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
        encryptedPassword = await bcrypt.hash(password, 10);
    
        const user = await User.create({
          role,
          password: encryptedPassword,
        });
    
        const token = jwt.sign(
          { user_id: user._id, role },
          process.env.TOKEN_KEY,
        );
        
        user.token = token;
    
        res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
});

app.post("/login", async (req, res) => {

    try {
      const { role, password } = req.body;
  
      if (!(role && password)) {
        res.status(400).send("All input is required");
      }
      const user = await User.findOne({ role });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user._id, role },
          process.env.TOKEN_KEY,
        );
  
        user.token = token;
  
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
                 budget, decorations, parties, photos, food, drinks, role} = req.body;

          const old = await InitialRequest.findOne({recordNumber});

          if (old) {
            return res.status(409).send("Event with record number already exists");
          }

          const initialRequest = await InitialRequest.create({
            recordNumber,
            clientName,
            eventType,
            attendees,
            budget,
            decorations,
            parties,
            photos,
            food,
            drinks,
            currentResponsible: role
          })

          res.status(200).json(initialRequest)
        }
        catch (err) {
          console.log(err);
      }
  })

  app.get("/initialRequestList", auth, async(req, res) => {
    try{
      const list = await InitialRequest.find({})

      res.status(200).json(list);
    }
    catch (err) {
      console.log(err)
    }
  })

  app.post('/updateInitialRequest', auth, async(req, res) => {
    try {
      InitialRequest.updateOne(
        {_id: req.body.id}, 
        {$set: {
          "recordNumber": req.body.recordNumber,
          "clientName": req.body.clientName,
          "eventType": req.body.eventType,
          "attendees": req.body.attendees,
          "budget": req.body.budget,
          "decorations": req.body.decorations,
          "parties": req.body.parties,
          "photos": req.body.photos,
          "food": req.body.food,
          "drinks": req.body.drinks,
          "currentResponsible": req.body.role,
        }},
        function(err, res) {
          if (err) console.log(err);
        }
        );

    res.status(200).send('ok');

    } catch (err) {
      console.log(err);
    }
  })

  app.post('/deleteInitialRequest', auth, async(req,res) => {
    try {
      const request = await InitialRequest.findOne({recordNumber:req.body.recordNumber});
      const _id = new ObjectID(request._id);
      await InitialRequest.deleteOne({_id:_id});
      res.status(200).send('Ok');
    }
    catch (err) {
      console.log(err);
    }
  })

  app.post('/storeTask', auth, async(req, res) => {
    try {
      const {recordNumber, description, assignee, priority, department} = req.body;
      const task = Task.create({
        recordNumber,
        description,
        assignee,
        priority,
        department,
      })

      res.status(200).json(task);

    } catch (err) {
      console.log(err);
    }
  })

  app.get("/taskList", auth, async(req, res) => {
    try{
      const list = await Task.find({})

      res.status(200).json(list);
    }
    catch (err) {
      console.log(err)
    }
  })


  app.post("/addNoteTask", auth, async(req, res) => {
    try {
      const {note} = req.body;
      await Task.updateOne(
      {_id: req.body.id},
      { $push: {notes: note}}
      )

      res.status(200).send('OK');
    }
    catch(err) {
      console.log(err);
    } 
  })

  app.post('/addRecruitmentRequest', auth, async(req, res) => {
    try {
      const {duration, department, years, title, description} = req.body;
      const request = await RecruitmentRequest.create({
        duration,
        department,
        years,
        title,
        description,
        status:'unhandled',
      })
      res.status(200).json(request);
    }
    catch (err) {
      console.log(err);
    }
  })

  app.get('/recruitmentList', auth, async(req, res) => {
    try {
      const list = await RecruitmentRequest.find({});
      res.status(200).json(list);
    } catch(err) {
      console.log('recruitmentlist error', err);
    }
  })

  app.post('/changeRecruitmentStatus', auth, async(req,res) => {
    try {
      const {id, status} = req.body;
      await RecruitmentRequest.updateOne(
        {_id: id}, 
        {$set: {
          status: status,
        }},
      )

      res.status(201).send('OK');
    }
    catch(err) {
      console.log('status change error', err);
    }
  })

  app.post('/addFinancialRequest', auth, async(req, res) => {
    try {
      const {reference, department, amount, reason} = req.body;
      const request = await FinancialRequest.create({
        reference,
        department,
        amount,
        reason,
        status:'unhandled',
      })
      res.status(200).json(request);
    }
    catch (err) {
      console.log(err);
    }
  })

  app.get('/financialList', auth, async(req, res) => {
    try {
      const list = await FinancialRequest.find({});
      res.status(200).json(list);
    }
    catch (err) {
      console.log(err);
    }
  })

  app.post('/changeFinancialStatus', auth, async(req,res) => {
    try {
      const {id, status} = req.body;
      await FinancialRequest.updateOne(
        {_id: id}, 
        {$set: {
          status: status,
        }},
      )

      res.status(201).send('OK');
    }
    catch(err) {
      console.log('status change error', err);
    }
  })
module.exports = app;