var bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


var admin = require("firebase-admin");


var serviceAccount = require("./ageblock-96602-firebase-adminsdk-mf95a-142f9be495.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ageblock-96602.firebaseio.com"
});

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
        fb_app.auth().signInWithEmailAndPassword(user.email, user.password).then((responseUser) => {
            var result = {
                'uid': responseUser.user.uid,
                'name': responseUser.user.displayName,
                'email': responseUser.user.email
            }
            var db = admin.firestore();
            db
                .collection("users")
                .doc(result.uid)
                .get()
                .then((doc) => {
                    response.status(200).send({ 'user': doc.data() });
                })
                .catch((err) => {
                    response
                        .status(400)
                        .send({ "msg": 'db_err' });
                });
        }).catch((error) => {
            console.log("Error login:", error);
            if (error.code == 'auth/network-request-failed') {
                response
                    .status(400)
                    .send({ "msg": 'no_internet' });
            }
            else {
                response
                    .status(400)
                    .send({ "msg": 'wrong_creds' });
            }
        });
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
                        result.push(results.docs[i].data());
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
                        result.push(results.docs[i].data());
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
                        result.push(results.docs[i].data());
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
                        result.push(results.docs[i].data());
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
                        result.push(results.docs[i].data());
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
                        result.push(results.docs[i].data());
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
                        result.push(results.docs[i].data());
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
                        result.push(results.docs[i].data());
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))