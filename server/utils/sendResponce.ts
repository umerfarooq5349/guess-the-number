import { Response } from "express";

export const sendResponce = (
  res: Response,
  statusCode: number,
  status: string,
  message: string,
  data: any
) => {
  res.status(statusCode).json({
    status,
    message,
    length: data.length,
    data,
  });
};
