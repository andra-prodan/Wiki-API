const express = require('express');
const bodyParcer = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const _ = require('lodash');
require('dotenv').config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MongoDB, { useNewUrlParser: true });

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParcer.urlencoded({ extended: true }));
app.use(express.static('public'));

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('article', articleSchema);


app.route("/articles")

.get(function (req, res) {
    Article.find({}, function (err, articles) {
        if (!err) {
            res.send(articles);
        } else {
            res.send(err);
        }
    });
})

.post(function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function (err) {
        if (!err) {
            res.send("Successful");
        } else {
            res.send(err);
        }
    });
})

.delete(function (req, res) {
    Article.deleteMany({}, function (err) {
        if (!err) {
            res.send("Successful");
        } else {
            res.send(err);
        }
    });
});


app.route("/articles/:article")

.get(function(req,res){
    Article.findOne({title:req.params.article},function(err,article){
        if(!err){
            res.send(article);
        }else{
            res.send(err);
        }
    });
})

.put(function(req,res){
    Article.replaceOne({title:req.params.article},{
        title:req.body.title,
        content:req.body.content
    },{
        overwrite:true
    },function(err){
        if(!err){
            res.send("Successful");
        }else{
            res.send(err);
        }
    });
})

.patch(function(req,res){
    Article.findOneAndUpdate({title:req.params.article},req.body,function(err){
        if(!err){
            res.send("Successful");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.findOneAndDelete({title:req.params.article},{},function(err){
        if(!err){
            res.send("Successful");
        }else{
            res.send(err);
        }
    });
})


app.listen(process.env.PORT || 3000, function () {
    console.log('Server running...');
});
