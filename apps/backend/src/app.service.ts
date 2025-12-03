import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Hello World endpoint was called');
    return 'Hello World!';
  }
}
