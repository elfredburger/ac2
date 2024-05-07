import{Request,Response,NextFunction} from 'express'
import HttpException from '@utils/exceptions/http.exceptions'

export default function errorMiddleware(error:HttpException,req:Request,res:Response,next:NextFunction):void{
    const status = error.status
    const message = error.message
    res.status(status).send({
        status,
        message
    })
}