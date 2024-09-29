import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  MercuriusFederationDriver,
  MercuriusFederationDriverConfig,
} from '@nestjs/mercurius';
import { join } from 'path';
import { TestResolver } from './test.resolver';

@Module({
  imports: [
    GraphQLModule.forRootAsync<MercuriusFederationDriverConfig>({
      driver: MercuriusFederationDriver,
      useFactory: () => ({
        sortSchema: true,
        autoSchemaFile: {
          path: join(process.cwd(), 'schema.graphql'),
          federation: {
            version: 2,
          },
        },
        graphiql: true,
        allowBatchedQueries: true,
      }),
    }),
  ],
  providers: [TestResolver],
})
export class GraphqlModule {}
