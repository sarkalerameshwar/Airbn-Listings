const express = require("express");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    eamil:{
        type : String,
        require : true
    },
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);