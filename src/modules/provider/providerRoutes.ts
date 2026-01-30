import express from "express";
import { ProviderController } from "./providerController";

const router = express.Router();

router.get("/", ProviderController.getAllProviders);
router.get("/:id", ProviderController.getProviderDetails);

export const ProviderRoutes = router;