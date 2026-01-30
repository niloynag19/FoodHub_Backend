import { Request, Response } from "express";
import { ProviderService } from "./providerService";


const getAllProviders = async (req: Request, res: Response) => {
  const result = await ProviderService.getAllProvidersFromDB();
  res.status(200).json({
    success: true,
    message: "Providers retrieved successfully",
    data: result,
  });
};

const getProviderDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProviderService.getProviderWithMenuFromDB(id as string);

  if (!result) {
    return res.status(404).json({ success: false, message: "Provider not found!" });
  }

  res.status(200).json({
    success: true,
    message: "Provider with menu retrieved successfully",
    data: result,
  });
};

export const ProviderController = {
  getAllProviders,
  getProviderDetails,
};