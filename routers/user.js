const express = require('express');
const router = express.Router();
require('dotenv').config();
const Signup= require('../models/signup.js');
const jwt = require('jsonwebtoken');
const organisation= require('../models/organisation.js');
//const JWT_SECRET = 'secret';

router.post('/User/signUp',async function(req,res){
    const newlogin = new Signup({
        Name: req.body.Name,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        orgId: req.body.orgId
    });
    const existlogin= await Signup.findOne({phoneNumber: newlogin.phoneNumber});
    if(existlogin){
        res.json('Already user exists');
    }
    else{
        await newlogin.save();
        const org= await organisation.findOne({orgId: newlogin.orgId});
        //res.json({Name:newlogin.name ,phoneNumber:newlogin.phoneNumber,orgId:newlogin.orgId,orgIp:org.orgIp});
        //const token= jwt.sign({userId: newlogin._id}, JWT_SECRET);
        //res.json({token});
        const responseData = {
            Name: newlogin.Name,
            phoneNumber: newlogin.phoneNumber,
            orgId: newlogin.orgId,
            orgIp: org.orgIp,
            token: jwt.sign({ userId: newlogin._id }, process.env.JWT_SECRET),
          };
          res.json(responseData);
    }

});

router.get('/', (req,res) => res.send("Router page"));

router.post('/user/login',async function(req,res){
    const login= new Signup({
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
    });
    const exist= await Signup.findOne({phoneNumber:login.phoneNumber});
    if(exist!=null ){
        if(login.password==exist.password){
            const org= await organisation.findOne({orgId: exist.orgId});
            //res.json({Name:exist.Name,phoneNumber:exist.phoneNumber,orgId:exist.orgId,orgIp:org.orgIp});
            //const token= jwt.sign({userId: exist._id}, JWT_SECRET);
           // res.json({token});
           const responseData = {
            Name: exist.Name,
            phoneNumber: exist.phoneNumber,
            orgId: exist.orgId,
            orgIp: org.orgIp,
            token: jwt.sign({ userId: exist._id }, process.env.JWT_SECRET),
          };
          res.json(responseData);
        }
        else{
            res.json('password mismatch');
        }
    } 
    else{
        res.json('phone number is not exist')
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token expired' });
      }
      req.userId = decoded.userId;
      console.log('Inside middleware ' + decoded.userId);
      next();
    });
  };

router.post('/user/update',authenticateToken,async function(req,res){
  console.log('Outside middleware (client)' + req.userId);
    const newupdate = new Signup({
        Name: req.body.Name,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        orgId: req.body.orgId
    });
    const org= await organisation.findOne({orgId: newupdate.orgId});
    await Signup.findByIdAndUpdate(req.userId, {Name:newupdate.Name,phoneNumber: newupdate.phoneNumber,password:newupdate.password,orgId:newupdate.orgId});
    //res.json({token});
    //res.json({name:newupdate.Name ,phoneNumber:newupdate.phoneNumber,orgId:newupdate.orgId,orgIp:org.orgIp});
    const responseData = {
        Name: newupdate.Name,
        phoneNumber: newupdate.phoneNumber,
        orgId: newupdate.orgId,
        orgIp: org.orgIp,
        token: jwt.sign({ userId: newupdate._id }, process.env.JWT_SECRET),
      };
      res.json(responseData);
});

module.exports = router;