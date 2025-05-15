import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

export interface ClassConstructor {
  new (...args: any[]): {};
}

@Injectable()
export class ResponseSerializeInterceptor implements NestInterceptor {
  constructor(private readonly _dto: ClassConstructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return plainToClass(this._dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
