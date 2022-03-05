import { Response } from 'express';

class Controller {
  /**
     *
     * @param res server response object
     * @param data response payload to be sent to the client
     * @param message response message for success response
     * @param statusCode server response status code
    */
  public sendSuccessResponse(
    res: Response,
    data:object,
    message:string,
    statusCode:number,
  ): Response {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }
}

export default Controller;
