import { Catch, RpcExceptionFilter, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException | BadRequestException, host: ArgumentsHost) {
    return host.switchToRpc().getData();
  }
}
