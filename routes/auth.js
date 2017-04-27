"use strict";

var express = require("express");
var router = express.Router();
var passport = require("passport");
var octonode = require("octonode");
var mongoose = require("mongoose");
var config = require("./../config/config");
var sg = require('sendgrid')(config.sendgrid.SENDGRID_API_KEY);

// Setup database:

mongoose.connect(config.database.credentials);

var Schema = mongoose.Schema;

var CommitSchema = new Schema({
    type: String,
    organization: String,
    repository: String,
    author: String,
    message: String,
    notRead: Boolean
});

var ReleaseSchema = new Schema({
    type: String,
    organization: String,
    repository: String,
    author: String,
    version: String,
    title: String,
    message: String,
    notRead: Boolean
});

var Commits = mongoose.model('Commits', CommitSchema);
var Releases = mongoose.model('Releases', ReleaseSchema);

var db = mongoose.connection;

if (config.database.credentials === undefined)
    throw new Error("No database credentials given");

router.get("/",
    passport.authenticate('github', { scope: [ 'admin:org_hook' ] }),
    function(req, res){
    });

router.get("/callback",
    passport.authenticate('github', { failureRedirect: 'https://github.com/' }),
    function(req, res) {

        //Create client for GitHub API requests:

        var client = octonode.client(req.user.accessToken);

        /***
         * Get organizations from GitHub API.
         * @param username
         */

        function organizationsToDatabase(username) {

            client.get('/users/'+ username +'/orgs', {}, function (err, status, body, headers) {

                body.forEach(function(organization) {
                    createGithubWebhook(organization.login);
                });

            });
        }

        /***
         * Creat Webhook for organizations.
         * @param organization
         */

        function createGithubWebhook(organization) {

            var ghorg = client.org(organization);

            ghorg.hook({
                "name": "web",
                "active": true,
                "events": ["push", "release"],
                "config": {
                    "url": "https://shrouded-hamlet-39019.herokuapp.com/auth/github/callback",
                    "content_type": "json"
                }
            }, function (err, status, body, headers) {
                console.log(err);
                console.log(status);
                console.log(body);
            });
        }

        organizationsToDatabase(req.user.profile.username);

        var commits;

        Commits.find({}, function(err, commits){
            if(err){
                console.log(err);
            } else{
                commits = commits;
                Releases.find({}, function(err, releases){
                    if(err){
                        console.log(err);
                    } else{
                        res.render('dashboard',{profile: req.user.profile.username, commits: commits, releases: releases});
                    }
                }).lean();
            }
        }).lean();

    }
);

router.post("/callback",
    function(req, res){

        //GitHub Webhook payload:

        var webhookPayload = req.body;

        if(webhookPayload.commits) {

            // Save commit to database:

            var commit = new Commits({
                type: "Commit",
                organization: webhookPayload.organization.login,
                repository: webhookPayload.repository.name,
                author: webhookPayload.sender.login,
                message: webhookPayload.head_commit.message,
                notRead: true
            });

            commit.save(function (err) {
                if (err)
                    return console.log(err);
            });

            // Send email to user:

            var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: {
                    personalizations: [
                        {
                            to: [
                                {
                                    email: webhookPayload.head_commit.author.email
                                }
                            ],
                            subject: 'Hello a new commit has been added!'
                        }
                    ],
                    from: {
                        email: 'noreply@githubdashboard.com'
                    },
                    content: [
                        {
                            type: 'text/plain',
                            value: 'Organization: ' + webhookPayload.organization.login + ' - Repository: ' + webhookPayload.repository.name + ' - Author: ' + webhookPayload.sender.login + ' - Message: ' + webhookPayload.head_commit.message + ' '
                        }
                    ]
                }
            });

            sg.API(request, function (error, response) {
                if (error) {
                    console.log('Error response received');
                }
                console.log(response.statusCode);
                console.log(response.body);
                console.log(response.headers);
            });

        }
        else {

            // Save release to database:

            var release = new Releases ({
                type: "Release",
                organization: webhookPayload.organization.login,
                repository: webhookPayload.repository.name,
                author: webhookPayload.sender.login,
                version: webhookPayload.release.tag_name,
                title: webhookPayload.release.name,
                message: webhookPayload.release.body,
                notRead: true
            });
            release.save(function (err) {
                if (err)
                    return console.log(err);
            });

            // Send email to user:

            var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: {
                    personalizations: [
                        {
                            to: [
                                {
                                    email: webhookPayload.head_commit.author.email
                                }
                            ],
                            subject: 'Hello a new release has been added!'
                        }
                    ],
                    from: {
                        email: 'noreply@githubdashboard.com'
                    },
                    content: [
                        {
                            type: 'text/plain',
                            value: 'Organization: ' + webhookPayload.organization.login + ' - Repository: ' + webhookPayload.repository.name + ' - Author: ' + webhookPayload.sender.login + ' - Version: ' + webhookPayload.release.tag_name + ' - Title: ' + webhookPayload.release.name + ' - Message: ' + webhookPayload.release.body + ' '
                        }
                    ]
                }
            });

            sg.API(request, function (error, response) {
                if (error) {
                    console.log('Error response received');
                }
                console.log(response.statusCode);
                console.log(response.body);
                console.log(response.headers);
            });
        }
        res.sendStatus(200);
    });

router.get("/logout", function(req, res) {

    // Update commits to read:

    Commits.update({notRead: true}, {notRead: false}, {multi: true},
        function(err, num) {
            console.log("updated "+num);
        }
    );

    req.logout();
    res.redirect("https://github.com/");
});

module.exports = router;
