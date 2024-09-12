import { SetMetadata } from '@nestjs/common';

export const ExcludeLogging = () => SetMetadata('LOGGING_INTERCEPTOR_SKIP', true);
