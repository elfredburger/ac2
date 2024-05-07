


import express,{Application} from 'express'
import mongoose from 'mongoose'
import Controller from '@utils/interfaces/controller.interface'
import errorMiddleware from '@middleware/error.middleware'
import cors from 'cors'
import helmet from 'helmet'
export default class App{
    public express:Application;
    public port:number;
    constructor(controllers:Controller[],port:number){
        this.express=express();
        this.port=port;

        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware():void{
        this.express.use(helmet())
        this.express.use(cors())
        this.express.use(express.json())
        this.express.use(express.urlencoded({extended:false}))

    }
    private initialiseControllers(controllers:Controller[]):void{
        controllers.forEach((controller:Controller)=>{
            this.express.use('/api',controller.router);
        });
    
    }
    private initialiseErrorHandling():void{
        this.express.use(errorMiddleware);
    }

    private initialiseDatabaseConnection():void{
        const {MONGO_USER, MONGO_PASSWORD, MONGO_URL}=process.env;
        mongoose.connect(`mongo://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_URL}`)
    }
}

