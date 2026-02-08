import express from 'express';
import * as council from "../controllers/councilController.js";
const router = express.Router();

router.get("/fetch-council-members", council.getCouncilData);

export default router;