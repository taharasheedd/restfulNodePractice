const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');
const req = require('express/lib/request');
const _ = require('lodash');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const connection = ("mongodb://localhost:27017/wikiDB");
mongoose.connect(connection, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Database Connection Successful');
    }
});

articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema);
app.listen(3000, (req, res) => {
    console.log("Server is Up and running");
});
app.route("/articles").get((req, res) => {
    Article.find(function(err, resultsFound) {
        if (err) {
            res.send(err);
        } else {
            res.send(resultsFound)
            console.log("Found Results");
        }
    })
}).post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Success");
        }
    })
}).delete((req, res) => {
    Article.deleteMany({}, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Success");
        }
    })
});
app.route("/articles/:articleTitle").get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, function(err, resultFound) {
            if (resultFound) {
                res.send(resultFound);
            } else {
                res.send("Following Error Occured" + err);
            }
        });
    }).delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Deleted " + req.params.articleTitle)
            }
        })
    }).put((req, res) => {
        Article.updateOne({ title: req.params.articleTitle }, { $set: { title: req.body.title, content: req.body.content } }, { overwrite: true },
            (err) => {
                if (!err) {
                    res.send("updated");
                } else {
                    res.send("Not Updated");
                }
            });
    })
    .patch((req, res) => {
        Article.updateOne({ title: req.params.articleTitle }, { $set: { title: req.body.title, content: req.body.content } },
            (err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Successfully Updated");
                }
            });
    });