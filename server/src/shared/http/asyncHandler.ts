import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRouteHandler<TReq extends Request = Request> = (
  req: TReq,
  res: Response,
  next: NextFunction
) => Promise<void>;

export function asyncHandler<TReq extends Request = Request>(
  handler: AsyncRouteHandler<TReq>
): RequestHandler {
  return (req, res, next) => {
    void handler(req as TReq, res, next).catch(next);
  };
}
