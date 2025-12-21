import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

/**
 * Custom decorator to validate that a date property is before another date property
 * @param property - The related property name to compare with
 * @param validationOptions - Additional validation options
 */
export function IsBefore(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBefore',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (value && relatedValue) {
            return new Date(value) < new Date(relatedValue);
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be before ${relatedPropertyName}`;
        },
      },
    });
  };
}
