import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponse } from './paginated-response';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  description = 'Successful response',
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponse, model),
    ApiOkResponse({
      description, // Description personnalisable
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedResponse) },
          {
            properties: {
              data: {
                type: 'array',
                title: 'List of items',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
