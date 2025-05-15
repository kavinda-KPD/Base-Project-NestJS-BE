import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { QueryResponseWithPagination } from '../dtos/response.dto';

export interface ClassConstructor {
  new (...args: any[]): {};
}

@Injectable()
export class ArrayResponseSerializeInterceptorWithPagination
  implements NestInterceptor
{
  constructor(private readonly _dto: ClassConstructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        let { count, results, currentPage, offset } =
          data as QueryResponseWithPagination<any>;

        results = results.map((result) =>
          plainToClass(this._dto, result, { excludeExtraneousValues: true }),
        );
        const convertedResult: QueryResponseWithPagination<any> = {
          count,
          currentPage,
          offset,
          results,
        };

        return convertedResult;
      }),
    );
  }
}
