import { Request, Response } from 'express';
interface PingResponse {
  message: string;
}

// @Route("ping")
export default class PingController {
  // @Get("/")
  public async getMessage(): Promise<PingResponse> {
    return {
      message: "2233",
    };
  }
}
