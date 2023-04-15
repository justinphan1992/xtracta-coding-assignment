import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ORC_SERVICE_TOKEN } from './constants';

@Injectable()
export class AppService {
  constructor(
    @Inject(ORC_SERVICE_TOKEN) private readonly client: ClientProxy,
  ) {}

  async parseImage(file: Express.Multer.File) {
    try {
      return await lastValueFrom(
        this.client.send({ cmd: 'parse-image' }, file),
      );
    } catch (error) {
      throw new RpcException(error.response);
    }
  }
}
