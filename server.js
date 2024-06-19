import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import User from "./models/user.js";
import flash from "connect-flash";
import session from "express-session";
import path from "path";
import multer from "multer";

const app = express();
const port = 3000;

app.use(
    session({
        secret: "resulting",
        resave: false,
        saveUninitialized: true,
    })
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

mongoose
    .connect("mongodb://127.0.0.1:27017/testing1234", { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB connected Successfully");
    })
    .catch((err) => {
        console.log("Error:", err);
    });

const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, callback) => {
        callback(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage });

app.get("/admin-login", (req, res) => {
    res.render("admin-login");
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/admin-exam", (req, res) => {
    res.render("admin-exam-details-upload");
});

app.get("/result", (req, res) => {
    res.render("result-form", { message: req.flash("message") });
});

app.get("/pdf", (req, res) => {
    res.render("pdf");
});

app.post("/result", async (req, res) => {
    try {
        const reg = req.body.reg;
        const user = await User.findOne({ reg: reg });
        if (!user) {
            return res.json({ message: "Student not found!" });
        }
        console.log("test");
        const userId = user._id;
        res.redirect(`/result/${userId}`);
    } catch (err) {
        console.log("Error:", err);
    }
});

app.get("/result/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const response = await User.findById({ _id: userId });
        if (!response) {
            return res.redirect("/result");
        }
        res.render("result-details", {});
    } catch (err) {
        console;
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/admin-exam", upload.single("image"), (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const branch = req.body.branch;
    const roll = req.body.roll;
    const reg = req.body.reg;
    const maths = req.body.maths;
    const dsa = req.body.dsa;
    const be = req.body.be;
    const chemistry = req.body.chemistry;
    const comm = req.body.comm;
    const subtotal = req.body.subtotal;
    const status = req.body.status;
    const isPresent = User.findOne({ reg: reg });
    if (!isPresent) {
        res.send("User already present");
    }
    const newUser = new User({
        name,
        email,
        branch,
        roll,
        reg,
        maths,
        dsa,
        be,
        chemistry,
        comm,
        subtotal,
        status,
    });
    newUser.save();
    res.redirect("/admin-exam");
});

app.post("/login", (req, res) => {
    const user = req.body.email;
    const pass = req.body.password;
    if (user === "admin@123" && pass === "123") {
        res.redirect("/admin-exam");
    } else {
        res.send("password not match");
    }
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});

app.get("/profile", (req, res) => {
    res.render("profile");
});
