import express from "express";

export class HttpException extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export const errorMiddleware = (
  err: HttpException,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const status = err.statusCode || 500;
  const message = err.message || "Unknown error";
  console.log(err);

  res.status(status).send({
    status: "error",
    error: message
  });
};
