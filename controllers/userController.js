const usersModel = require('../models/user');
const {firebase} = require('../functions/firebase');

  module.exports = (app) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          // ...
        } else {
          
        }
      });

    app.get('/login', (req, res) => {
    
      return res.render('auth/login');
    });

    app.get('/users', (req, res) => {
      var user = firebase.auth().currentUser;
      if (user) {
        // User is signed in.
        console.log("hay usuario: " , user.email)
      } else {
          console.log("no hay usuario" )
        // No user is signed in.
      }

      return res.json({ok:true})
    })
    app.post('/googleLogin', (req, res) => {
      var token_id = req.body.token_id;      
      var credential = firebase.auth.GoogleAuthProvider.credential(token_id);
      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(credential)
      .then(async (resp) => {
        let userExist = await usersModel.find({email: resp.user.email});
        if(userExist.length == 0) {
          await (usersModel({email: resp.user.email, isGoogle: true})).save();
          return res.json({ok: true, msg:"usuario creado."})
        }
        if(userExist.length > 0 && !userExist.isGoogle) {
          return res.json({ok: false, msg: "Este correo se encuentra en uso"})
        } else {
          return res.json({ok: true})
        }

      })
    })
    app.post('/signIn', async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          var user = userCredential.user;
          if(user) {
            await usersModel({email}).save();
          }
          
        })
        .catch((error) => {
          console.log(error)
        });

        return res.json({ok: true})
    });
    app.post('/login', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            return res.json({ok: true, user})
            // ...
        })
        .catch((error) => {
            return res.json({ok: false, error})
            // ..
        });
    });
}
