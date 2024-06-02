import { applyDecorators } from '@nestjs/common';
import {
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { API_RESPONSE_DESCRIPTION } from '../constants';
import { PaginatedResponseDto } from '../dtos/paginated-response.dto';
import { ErrorEnum } from '../enums/error.enum';
import { SwaggerDocumentationOptions } from '../interfaces/swagger-documentation.interface';
import { Env } from '../enums/common.enum';
export const SwaggerDocumentation = (data: SwaggerDocumentationOptions) =>
  applyDecorators(
    data.hideEnvs?.length > 0 && data.hideEnvs?.includes(process.env.DEPLOY_ENV as Env)
      ? ApiExcludeEndpoint()
      : () => ({}),
    ApiOperation({
      description: data.endpointDescription,
      summary: data.endpointSummary,
    }),
    ApiNotFoundResponse({
      description: data.error404Description ?? ErrorEnum.ENTITY_NOT_FOUND,
    }),
    ApiInternalServerErrorResponse({
      description: data.error500Description ?? ErrorEnum.INTERNAL_SERVER_ERROR,
    }),
    ApiOkResponse({
      schema: data.isArray
        ? {
            type: 'array',
            items: { $ref: getSchemaPath(data.responseDto) },
          }
        : { $ref: getSchemaPath(data.responseDto) },
      description: API_RESPONSE_DESCRIPTION,
    }),
    data.isPaginated
      ? ApiOkResponse({
          schema: {
            allOf: [
              { $ref: getSchemaPath(PaginatedResponseDto) },
              {
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      $ref: getSchemaPath(data.responseDto),
                    },
                  },
                },
              },
            ],
          },
          description: API_RESPONSE_DESCRIPTION,
        })
      : () => ({}),
    data.responseDto
      ? ApiExtraModels(data.responseDto, data.isPaginated ? PaginatedResponseDto : data.responseDto)
      : () => ({}),
  );
