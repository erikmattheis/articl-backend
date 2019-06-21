var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('./mongoDBFunction.js');

var app = express();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//app.use(bodyParser.urlencoded({ extended: false }));


//  not finish
app.get('/allQuestions',function(req,res){
    var responseObject = [{
        name: "haha"
    },{
        name: "yue"
    }];
    res.send(responseObject);
})


//  example:
//  http://localhost:3000//findQuestion/abc
app.get('/findQuestion/:id',function(req,res){
    console.log("try to find: " + req.params.id);
    mongodb.findQuestion(req.params.id, function(result){
        var question = result[0];
        if(question === undefined){
            console.log("Not find.")
            var jsonResponse = {
                "notification":"can not find"
            };
            res.json(jsonResponse);

        }else{
        console.log("Found: " + req.query.id);
        res.body = JSON.stringify(question.oneQuestion);
        res.send(res.body);
    }
    });
})



app.post('/postOneQuestionByJSON',jsonParser,function(req, res){
    if (!req.body)
        return res.sendStatus(400);
    var oneQuestion = {
        id: req.body.id,
        name: req.body.name,
        category: req.body.category,
        question: req.body.question
    };
    mongodb.insertQuestion(oneQuestion);
    console.dir(req.body);
    var jsonResponse = {
        id: '123', status: 'updated'
    };
    res.json(jsonResponse);
})

app.post('/postOneQuestionByForm',urlencodedParser,function(req, res){
    if (!req.body)
        return res.sendStatus(400);
    var oneQuestion = {
        id: req.body.id,
        name: req.body.name,
        category: req.body.category,
        question: req.body.question
    };
    mongodb.insertQuestion(oneQuestion);
    console.dir(req.body);
    var jsonResponse = {
        id: '123', status: 'updated'
    };
    res.json(jsonResponse);
})

app.listen(3000);
console.log('listening to port 3000');