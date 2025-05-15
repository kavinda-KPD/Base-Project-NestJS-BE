import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/application/app.service';
import { Public } from '../auth-module/decorators/auth.decorator';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
