const mysql =require("mysql")
const express=require("express")
const bodyparser=require("body-parser")

var app=express();
app.use(bodyparser.json)

const mysqlConnection=mysql.createConnection({
    host:"localhost",
    user:"singhabhishek",
    password:"singhabhishek",
    database:"singhabhishek",
    multipleStatement:true
});
mysqlConnection.connect((err)=>{
    if(!err)
    {
        console.log("Connected");
    }
    else
    {
        console.log("Connection failed");
    }
})
app.listen(3000)
