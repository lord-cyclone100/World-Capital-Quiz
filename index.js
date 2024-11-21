import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config';

const port = 3000;
const app = express();
app.use(express.static('public'));

const username = process.env.DATABASENAME;
const password = process.env.PASSWORD;

app.use(bodyParser.urlencoded({ extended:true }));

const getRandomNumber = (num)=>{
    return Math.floor(Math.random() * num);
}

const db = new pg.Client({
    user: username,
    host: "localhost",
    database: "world",
    password: password,
    port: 5432
})

db.connect();

let quiz = [];
db.query("select * from capitals",(err,res)=>{
    if(err){
        console.log("Error executig query",err.stack);
    }
    else{
        quiz = res.rows;
    }
    db.end();
})

app.get('/',(req,res)=>{
    let randomCountry = getRandomNumber(quiz.length);
    res.render("index.ejs",{
        "countryName":quiz[randomCountry]["country"],
        "countryCapital":quiz[randomCountry]["capital"],
        "score":0
    })
})

app.post('/done',(req,res)=>{
    const a = req.body["countryCapital"];
    const b = req.body["nameCountry"];
    const c = parseInt(req.body["score"],10);
    if(a.toLowerCase() === b.toLowerCase()){
        let randomCountry = getRandomNumber(quiz.length);
        res.render("index.ejs",{
            "countryName":quiz[randomCountry]["country"],
            "countryCapital":quiz[randomCountry]["capital"],
            "score": (c+1).toString()
        });
    }
    else{
        res.render("restart.ejs",{"score": c.toString()});
    }
})

app.get('/restart',(req,res)=>{
    res.render('restart.ejs');
})

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})