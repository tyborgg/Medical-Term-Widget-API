const express = require("express");
const db = require("./mysqlConnection");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
const dotenv = require('dotenv');
const port = process.env.port || 3000;

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());

db.connect((err) => {
    if(err) console.log(err);
    else console.log("MySQL DB Connected");
});

//Defintions
app.post("/widget_api/definition", cors(), (req, res) => {
    function callBack(data){
        res.json(data); 
    };
    
    async function getData (){
        var termList = [];
        var data = [];

        //Parse User Text
        var userText = req.body.text.replace(/ /g, '+');

        //Call the tagger API and get the terms
        var res = await axios.get("http://data.bioontology.org/annotator?text=" + userText + "&longest_only=true&apikey=" + process.env.API_KEY);
        var terms = res.data;
        
        for(let i = 0; i < terms.length; i++){
            if(termList.indexOf(terms[i].annotations[0].text) == -1){
                termList.push(terms[i].annotations[0].text);
            }
        }

        console.log(termList);
        
        for(let i = 0; i < termList.length; i++){
            var res = await axios.get("http://localhost:5000/definition/term/" + termList[i]);
            data.push({[termList[i]]: res.data});
        }

        return callBack(data);
    }

    getData();
});

//Relations
app.post("/widget_api/relation", cors(), (req, res) => {
    function callBack(data){
        res.json(data); 
    };
    
    async function getData (){
        //Call the tagger API and get the terms
        var terms = ["heart", "kidney", "muscle", "cancer"];
        var data = [];
        
        for(let i = 0; i < terms.length; i++){
            var res = await axios.get("http://localhost:5000/relation/term/" + terms[i]);
            data.push({[terms[i]]: res.data});
        }

        return callBack(data);
    }

    getData();
});

app.listen(port,() => {
    console.log("Server running...")
});