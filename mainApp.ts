import { Application, Request, Response } from "express";
import { statusCode } from "./utils/statusCode";
import { v4 as uuid} from "uuid"
import moment from "moment";
import fs from "fs";
import path from "path";

interface iData{
    id: string;
    time: string;
    name: string;
    course: string;
}



let database: Array<iData>= []

const mainApp = (app:Application) =>{
    app.get('/', (req:Request, res:Response):Response =>{
        try{
            return res.status(statusCode.OK).json({
                message: "welcome to my API service",
            });
        }catch (error){
            return res.status(statusCode.NOT_FOUND).json({
                message: "Error",
            });
        };
    });

    app.get('/api/v1/read-data', (req: Request, res: Response)=>{
        try{
            return res.status(statusCode.OK).json({
                message: "Reading from dataBase",
                data: database,
            });
        }catch(error){
            return res.status(statusCode.NOT_FOUND).json({
                message: "Error reading from dataBase",
            });
        }
    });

    app.post('/api/v1/create-data', (req: Request, res: Response):Response => {
        try{
            const {name, course} = req.body;

            const data: iData ={
                id: uuid(),
                name,
                course,
                time: moment(new Date().getTime()).format("LTS")
            };

            database.push(data);

            fs.writeFile(path.join(__dirname,"data", "data.json"),JSON.stringify(data), () =>{
                console.log("Done");
                
            });

            return res.status(statusCode.OK).json({
                message: "Creating from database",
                data,
            });
        }catch(error){
            return res.status(statusCode.NOT_FOUND).json({
                message: "Error creating from database"
            })
        }
    })

    app.patch('/api/v1/update-data/:userID', (req: Request, res: Response):Response => {
        try{

            const {name, course} = req.body;
            const {userID} = req.params;

            const user:iData|any = database.find((el: iData) =>{
                return el.id === userID;
            });

                user.course = course;

            return res.status(statusCode.OK).json({
                message: "Creating from database",
                data: user,
            });
        }catch(error){
            return res.status(statusCode.NOT_FOUND).json({
                message: "Error creating from database"
            })
        }
    })

    app.get('/api/v1/get-one-data/:userID', (req: Request, res: Response):Response => {
        try{
            const {name, course} = req.body;
            const {userID} = req.params;

            const user = database.find((el: iData) =>{
                return el.id === userID;
            })

            return res.status(statusCode.OK).json({
                message: "Getting one from database",
                data: user
            });
        }catch(error){
            return res.status(statusCode.NOT_FOUND).json({
                message: "Error creating from database"
            })
        }
    })

    app.delete('/api/v1/delte one-data/:userID', (req: Request, res: Response):Response => {
        try{

            const {name, course} = req.body;
            const {userID} = req.params;

            const user:iData|any = database.find((el: iData) =>{
                return el.id === userID;
            });

              const newdata = database.filter((el:iData) =>{
                return el.id!== userID;
              })

              database = newdata;

            return res.status(statusCode.OK).json({
                message: "Creating from database",
                data: user,
            });
        }catch(error){
            return res.status(statusCode.NOT_FOUND).json({
                message: "Error creating from database"
            })
        }
    })
};

export default mainApp;