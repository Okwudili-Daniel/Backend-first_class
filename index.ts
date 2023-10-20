import { error } from "console";
import express, {Application, Request, Response} from "express"
import mainApp from "./mainApp";

const port =3500

const app: Application = express();

app.use(express.json());

mainApp(app);

const server = app.listen(port, () =>{
    console.log("server is upand listening");
    
});

process.on("uncaughtException", (error: Error) =>{
    console.log("uncaughtException: ", error);
    
    process.exit(1);
})

process.on("rejectionHandled", (reason: any) =>{
    console.log("rejectionHandled: ", reason);
  
    server.close(() =>{
        process.exit(1)
    })
})