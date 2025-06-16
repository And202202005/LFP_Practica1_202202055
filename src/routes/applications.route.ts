import { Router } from "express";
import { hello } from "../controllers/application.controllers";

const appRouter = Router();

appRouter.get('/', hello);

export default appRouter;