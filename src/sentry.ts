import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  includeLocalVariables: true,
  debug: true,
  enabled: true,
  environment: 'development',
  integrations: [
    nodeProfilingIntegration(),
    Sentry.graphqlIntegration(),
    Sentry.localVariablesIntegration({
      captureAllExceptions: true,
      maxExceptionsPerSecond: 100,
    }),
  ],
});
