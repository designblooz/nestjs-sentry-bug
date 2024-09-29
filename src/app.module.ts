import { Module } from '@nestjs/common';
import { SentryModule } from '@sentry/nestjs/setup';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [SentryModule.forRoot(), GraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
