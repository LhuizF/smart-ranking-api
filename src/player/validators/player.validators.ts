import { ArgumentMetadata, PipeTransform, BadRequestException } from '@nestjs/common';

export class ValidationParamPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) throw new BadRequestException(metadata.data + ' is required');

    return value;
  }
}
