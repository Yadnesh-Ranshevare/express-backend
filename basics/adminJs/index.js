import express from "express";
import AdminJS from "adminjs"
import AdminJSExpress from '@adminjs/express'
import mongoose from 'mongoose'
import * as AdminJSMongoose from '@adminjs/mongoose'
import MongoStore from 'connect-mongo'

// mongoose model
import Profile from "./models/profile.model.js";
import User from "./models/user.model.js";
import Project from "./models/project.model.js";


// register mongoose
AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
})


const PORT = 3000

// admin email and password
const DEFAULT_ADMIN = {
    email: 'admin@gmail.com',
    password: 'admin@123',
}


// function for authentication to check if email password is correct or not
const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
}


// function for starting the admin server
const start = async () => {
    const app = express()

    // connect to database
    await mongoose.connect('your-mongo-url-to-store-the-models')

    // admin options
    const adminOptions = {
        resources: [User, Profile,Project], // pass the mongoose models here
    }

    const admin = new AdminJS(adminOptions)     // creating the adminJs instance


    // to add login page in admin js, keep most of the option as default
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,


        // auth option
        {
          authenticate,                         // Function to check admin login credentials
          cookieName: 'adminjs',                // Name of the cookie stored in browser
          cookiePassword: 'sessionsecret',      // Used to sign/encrypt the cookie this one is for adminJs to catch the fake cookie
        },


        // preRouterHook
        null,       // optional middleware function; we're skipping it by passing null


        // session option
        {
            
          store: MongoStore.create({
            mongoUrl: 'your-mongo-url-to-store-the-sessions',  // your db url to store the session data, it can be different one  or same as well
            ttl: 24 * 60 * 60,      // ttl (Time-To-Live) tell how long the session should stay active: 24 * 60 * 60 = 1 day
            
          }),
          resave: false,        // do not save the session back to the session store even if nothing changed.
          saveUninitialized: false,  // do not save the session to the store even if it’s new and hasn’t been modified yet.
          secret: 'sessionsecret',      // Used to sign/encrypt the cookie for Express itself and works even if you're not using AdminJS.
          cookie: {         // cookie options
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
          },
          name: 'adminjs',
        }
    )


  
    app.use(admin.options.rootPath, adminRouter)
  
    app.listen(PORT, () => {
      console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })
}

start()