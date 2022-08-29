const express = require("express");
const db = require("./mysqlConnection");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = process.env.port || 3000;

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
        //Call the tagger API and get the terms
        var terms = ["heart", "kidney", "muscle", "cancer"];
        var data = [];
        
        for(let i = 0; i < terms.length; i++){
            var res = await axios.get("http://localhost:5000/definition/term/" + terms[i]);
            data.push({[terms[i]]: res.data});
        }

        return callBack(data);
    }

    getData();
});

app.listen(port,() => {
    console.log("Server running...")
});