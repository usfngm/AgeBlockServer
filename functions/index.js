
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const _request = require('request');
var bodyParser = require('body-parser');
admin.initializeApp(functions.config().firebase);

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true })); // << for what you just defined

var firebase = require('firebase');
var fb_app = firebase.initializeApp({
    apiKey: "AIzaSyD6nDUfDrzIoYnZkPrxGbEiJCHuSVO80qo",
    authDomain: "ageblock-96602.firebaseapp.com",
    databaseURL: "https://ageblock-96602.firebaseio.com",
    projectId: "ageblock-96602",
    storageBucket: "ageblock-96602.appspot.com",
    messagingSenderId: "433649732018",
    appId: "1:433649732018:web:26ae37a9eaae0667"
});

app.post("/login", (request, response) => {
    if (request.body.user) {
        var user = request.body.user;
        var db = admin.firestore();
            db
                .collection("users")
                .doc(user.uid)
                .get()
                .then((doc) => {
                    response.status(200).send({ 'user': doc.data() });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": 'db_err' });
                })
    }
    else {
        console.log("FAIL PARAMETERS");
        response
            .status(400)
            .send({ "msg": 'missing_params' });
    }
});

// current
// history
// ALL / PENDING



app.post("/currentRequests", (request, response) => {
    if (request.body.user) {
        var user = request.body.user;
        var result = [];
        var db = admin.firestore();
        if (user.type == "parent") {
            db
                .collection("requests")
                .where("parentID", "==", user.uid)
                .where("status", "==", 2)
                .get()
                .then((results) => {
                    for (var i = 0; i < results.size; i++) {
                        var obj = results.docs[i].data();
                        obj.uid = results.docs[i].id;
                        result.push(obj);
                    }
                    response
                        .status(200)
                        .send({ "requests": result });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": err });
                });
        }
        else if (user.type == "elder") {
            db
                .collection("requests")
                .where("elderID", "==", user.uid)
                .where("status", "<", 3)
                .get()
                .then((results) => {
                    for (var i = 0; i < results.size; i++) {
                        var obj = results.docs[i].data();
                        obj.uid = results.docs[i].id;
                        result.push(obj);
                    }
                    response
                        .status(200)
                        .send({ "requests": result });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": err });
                });
        }
        else if (user.type == "volunteer") {
            db
                .collection("requests")
                .where("volunteerID", "==", user.uid)
                .where("status", "<=", 2)
                .get()
                .then((results) => {
                    for (var i = 0; i < results.size; i++) {
                        var obj = results.docs[i].data();
                        obj.uid = results.docs[i].id;
                        result.push(obj);
                    }
                    response
                        .status(200)
                        .send({ "requests": result });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": err });
                });
        }
    }
    else {
        console.log("FAIL PARAMETERS");
        response
            .status(400)
            .send({ "msg": 'missing_params' });
    }
});

app.post("/historyRequests", (request, response) => {
    if (request.body.user) {
        var user = request.body.user;
        var result = [];
        var db = admin.firestore();
        if (user.type == "parent") {
            db
                .collection("requests")
                .where("parentID", "==", user.uid)
                .where("status", "==", 3)
                .get()
                .then((results) => {
                    for (var i = 0; i < results.size; i++) {
                        var obj = results.docs[i].data();
                        obj.uid = results.docs[i].id;
                        result.push(obj);
                    }
                    response
                        .status(200)
                        .send({ "requests": result });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": err });
                });
        }
        else if (user.type == "elder") {
            db
                .collection("requests")
                .where("elderID", "==", user.uid)
                .where("status", "==", 3)
                .get()
                .then((results) => {
                    for (var i = 0; i < results.size; i++) {
                        var obj = results.docs[i].data();
                        obj.uid = results.docs[i].id;
                        result.push(obj);
                    }
                    response
                        .status(200)
                        .send({ "requests": result });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": err });
                });
        }
        else if (user.type == "volunteer") {
            db
                .collection("requests")
                .where("volunteerID", "==", user.uid)
                .where("status", "==", 3)
                .get()
                .then((results) => {
                    for (var i = 0; i < results.size; i++) {
                        var obj = results.docs[i].data();
                        obj.uid = results.docs[i].id;
                        result.push(obj);
                    }
                    response
                        .status(200)
                        .send({ "requests": result });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": err });
                });
        }
    }
    else {
        console.log("FAIL PARAMETERS");
        response
            .status(400)
            .send({ "msg": 'missing_params' });
    }
});

app.post("/allPendingRequests", (request, response) => {
    if (request.body.user) {
        var user = request.body.user;
        var result = [];
        var db = admin.firestore();
        if (user.type == "parent") {
            db
                .collection("requests")
                .where("parentID", "==", user.uid)
                .where("status", "==", 1)
                .get()
                .then((results) => {
                    for (var i = 0; i < results.size; i++) {
                        var obj = results.docs[i].data();
                        obj.uid = results.docs[i].id;
                        result.push(obj);
                    }
                    response
                        .status(200)
                        .send({ "requests": result });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": err });
                });
        }
        else if (user.type == "volunteer") {
            db
                .collection("requests")
                .where("status", "==", 0)
                .get()
                .then((results) => {
                    for (var i = 0; i < results.size; i++) {
                        var obj = results.docs[i].data();
                        obj.uid = results.docs[i].id;
                        result.push(obj);
                    }
                    response
                        .status(200)
                        .send({ "requests": result });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": err });
                });
        }
    }
    else {
        console.log("FAIL PARAMETERS");
        response
            .status(400)
            .send({ "msg": 'missing_params' });
    }
});

app.post("/request", (request, response) => {
    if (request.body.request) {
        var elderRequest = request.body.request;
        var db = admin.firestore();
        console.log('what we got');
        console.log(elderRequest);
        if (elderRequest.uid) { // UPDATE
            db
                .collection("requests")
                .doc(elderRequest.uid)
                .set(elderRequest)
                .then((doc) => {
                    response
                        .status(200)
                        .send({ "request": elderRequest });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": err.code });
                })
        }
        else { // NEW
            db
                .collection("requests")
                .add(elderRequest)
                .then((doc) => {
                    elderRequest.uid = doc.id;
                    response
                        .status(200)
                        .send({ "request": elderRequest });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": err.code });
                })
        }


    }
    else {
        console.log("FAIL PARAMETERS");
        response
            .status(400)
            .send({ "msg": 'missing_params' });
    }
});

app.post("/getUser", (request, response) => {
    if (request.body.user) {
        var user = request.body.user;
        var db = admin.firestore();
        db
            .collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
                response.status(200).send({ 'user': doc.data() });
            })
            .catch((err) => {
                response
                    .status(400)
                    .send({ "msg": 'db_err' });
            });
    }
    else {
        console.log("FAIL PARAMETERS");
        response
            .status(400)
            .send({ "msg": 'missing_params' });
    }
});

app.post("/registerElder", (request, response) => {
    if (request.body.user) {
        var user = request.body.user;
        user['email'] = user.email.toLowerCase();
        admin
            .auth()
            .createUser({ email: user.email, password: user.password, displayName: user.name })
            .then(function (userRecord) {
                var db = admin.firestore();
                if (user.password)
                    delete user.password;
                user.uid = userRecord.uid;
                db
                    .collection("users")
                    .doc(user.uid)
                    .set(user)
                    .then(function () {
                        db
                            .collection('users')
                            .doc(user.elder_parentID)
                            .get()
                            .then((doc) => {
                                var updatedUser = doc.data();
                                updatedUser.parent_elders.push(user.uid);
                                db.collection('users')
                                    .doc(updatedUser.uid)
                                    .set(updatedUser)
                                    .then(() => {
                                        response
                                            .status(200)
                                            .send({ 'user': user });
                                    })
                            })

                    })
                    .catch(function (error) {
                        response
                            .status(400)
                            .send({ 'msg': error });
                    });
            })
            .catch(function (error) {
                console.log("Error updating user:", error);
                response
                    .status(400)
                    .send({ 'msg': error.code });
            });
    } else {
        response
            .status(400)
            .send({ "msg": 'missing_params' });
    }
});

app.post("/register", (request, response) => {
    if (request.body.user) {
        var user = request.body.user;
        user['email'] = user.email.toLowerCase();
        admin
            .auth()
            .createUser({ email: user.email, password: user.password, displayName: user.name })
            .then(function (userRecord) {
                var db = admin.firestore();
                if (user.password)
                    delete user.password;
                user.uid = userRecord.uid;
                db
                    .collection("users")
                    .doc(user.uid)
                    .set(user)
                    .then(function () {
                        response
                            .status(200)
                            .send({ 'user': user });
                    })
                    .catch(function (error) {
                        response
                            .status(400)
                            .send({ 'msg': error });
                    });
            })
            .catch(function (error) {
                console.log("Error updating user:", error);
                response
                    .status(400)
                    .send({ 'msg': error.code });
            });
    } else {
        response
            .status(400)
            .send({ "msg": 'missing_params' });
    }
});

const api = functions
    .https
    .onRequest(app);

module.exports = {
    api
}
