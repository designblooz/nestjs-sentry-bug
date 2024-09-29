import { Catch, ExceptionFilter } from '@nestjs/common';
import { captureException } from '@sentry/nestjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown): void {
    captureException(exception);
    console.error(exception);

    throw exception;
  }
}
