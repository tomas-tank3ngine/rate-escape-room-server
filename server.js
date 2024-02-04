require("dotenv").config();
const knexConfig = require("./knexfile.js").development;
const knex = require('knex')(knexConfig)

const express = require("express");
const expressSession = require('express-session');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const PORT = process.env.PORT || 8080;



const authRoutes = require('./routes/authRoute.js')
const roomRoutes = require("./routes/roomRoute")
const userRoutes = require("./routes/userRoute")
const favoriteRoutes = require("./routes/favoriteRoute")

// Enable req.body middleware
app.use(express.json());

// Initialize HTTP Headers middleware
app.use(helmet());

// Enable CORS (with additional config options required for cookies)
app.use(
    cors({
        origin: true,
        credentials: true,
    })
)

// Include express-session middleware (with additional config options required for Passport session)
app.use(
	expressSession({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

//PASSPORT CONFIG
app.use(passport.initialize())

// Passport.session middleware alters the `req` object with the `user` value
// by converting session id from the client cookie into a deserialized user object.
// also requires 'serializeUser' and 'deserializeUser' functions below
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        function(accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
              return cb(err, user);
            });
          }
    )
)

// `serializeUser` determines which data of the auth user object should be stored in the session
// The data comes from `done` function of the strategy
// The result of the method is attached to the session as `req.session.passport.user = 12345`
passport.serializeUser((user, done) => {
	console.log('serializeUser (user object):', user);

	// Store only the user id in session
	done(null, user.id);
});

// `deserializeUser` receives a value sent from `serializeUser` `done` function
// We can then retrieve full user information from our database using the userId
passport.deserializeUser((userId, done) => {
	console.log('deserializeUser (user id):', userId);

	// Query user information from the database for currently authenticated user
	knex('users')
		.where({ id: userId })
		.then((user) => {
			// Remember that knex will return an array of records, so we need to get a single record from it
            // gets the first user that matches, and there should only be one match
			console.log('req.user:', user[0]);

			// The full user object will be attached to request object as `req.user`
			done(null, user[0]);
		})
		.catch((err) => {
			console.log('Error finding user', err);
		});
});


//Basic Home Route
app.get("/", (_req, res) => {
  res.send("Welcome to my API");
});

app.use("/rooms", roomRoutes);
app.use("/users", userRoutes);
app.use("/favorites", favoriteRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});