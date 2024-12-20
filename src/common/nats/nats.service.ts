import { HttpException, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NATS_SERVICE } from '../../config';

export class NatsService {
  private logger = new Logger('MicroserviceUtils');

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async send(service: string, data: any): Promise<any> {
    return this.client.send(service, data).pipe(
      catchError((err) => {
        if (!err || Object.keys(err).length === 0) {
          throw new HttpException('Microservice Unavailable', 503);
        }
        throw new HttpException(err, err.statusCode);
      }),
    );
  }

  async firstValue(service: string, data: any): Promise<any> {
    return firstValueFrom(
      this.client.send(service, data).pipe(
        catchError((err) => {
          if (!err || Object.keys(err).length === 0) {
            throw new HttpException('Microservice Unavailable', 503);
          }
          throw new HttpException(err, err.statusCode);
        }),
      ),
    );
  }
}
