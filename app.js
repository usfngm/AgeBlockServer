var bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


var admin = require("firebase-admin");


var serviceAccount = require("/Users/negm/Downloads/ageblock-96602-firebase-adminsdk-mf95a-142f9be495.json");

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
    console.log("RECIEVED REQ");
    console.log(request.body);
    if (request.body.user) {
        var user = request.body.user;
        fb_app.auth().signInWithEmailAndPassword(user.email, user.password).then((responseUser) => {
            var result = {
                'uid': responseUser.user.uid,
                'name': responseUser.user.displayName,
                'email': responseUser.user.email
            }
            console.log("SUCCESS");
            response.status(200).send({ 'user': result });
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
                            .send({ 'result': 1, 'user': user });
                    })
                    .catch(function (error) {
                        response
                            .status(400)
                            .send({ 'result': 0, 'error': error });
                    });
            })
            .catch(function (error) {
                console.log("Error updating user:", error);
                response
                    .status(400)
                    .send({ 'result': 0, 'error': error });
            });
    } else {
        response
            .status(400)
            .send({ 'result': 0, "error": "Incomplete Parameters" });
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))