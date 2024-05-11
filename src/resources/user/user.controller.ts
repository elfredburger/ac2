import { Router, Request, Response, NextFunction } from "express";
import Controller from "@utils/interfaces/controller.interface";
import HttpException from "@utils/exceptions/http.exception";
import validationMiddleware from "@middleware/validation.middleware";
import validate from "@resources/user/user.validation";
//import UserService from "@resources/user/user.service";
import authenticated from "@middleware/authenticated.middleware";
