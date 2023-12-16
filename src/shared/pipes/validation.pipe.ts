import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {

  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new HttpException(
        this.formatErrors(errors),
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]) {
    // eslint-disable-next-line consistent-return,array-callback-return
    return errors.map((err) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const property in err.constraints) {
        // eslint-disable-next-line no-prototype-builtins
        if (err.constraints.hasOwnProperty(property)) {
          return {
            path: err.property,
            message: err.constraints[property],
          };
        }
      }
    });
  }

  private isEmpty(value: unknown) {
    return Object.keys(value).length <= 0;
  }

}
