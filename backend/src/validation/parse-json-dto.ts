import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

type ClassConstructor<T> = {
  new (): T;
};

export function parseJsonDto<T extends object>(
  value: string,
  dtoClass: ClassConstructor<T>,
): T {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new BadRequestException('JSON invalide');
  }

  const dto = plainToInstance(dtoClass, parsed);
  const errors = validateSync(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    throw new BadRequestException({
      statusCode: 400,
      message: 'Erreurs de validation',
      errors,
    });
  }

  return dto;
}
