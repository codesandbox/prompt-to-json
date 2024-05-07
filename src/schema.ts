export type ValueTypes =
  | StringSchema
  | ArraySchema<any>
  | EnumSchema<any>
  | ObjectSchema<any, any>
  | AnyOf<any>
  | BooleanSchema;

export type BooleanSchema = {
  type: "boolean";
  description: string;
};

export type StringSchema = {
  type: "string";
  description: string;
};

export type ObjectSchema<
  P extends Record<string, ValueTypes>,
  R extends (keyof P)[],
> = {
  type: "object";
  properties: P;
  description: string;
  required: R;
};

export type ArraySchema<P extends ValueTypes> = {
  type: "array";
  description: string;
  items: P;
};

export type EnumSchema<P extends string> = {
  type: "string";
  description: string;
  enum: P[];
};

export type AnyOf<P extends ValueTypes> = {
  anyOf: P[];
};

export function array<P extends ValueTypes>(
  items: P,
  description: string,
): ArraySchema<P> {
  return {
    type: "array" as const,
    description,
    items,
  };
}

export function boolean(description: string): BooleanSchema {
  return {
    type: "boolean",
    description,
  };
}

export function enums<const P extends string>(
  enums: P[],
  description: string,
): EnumSchema<P> {
  return {
    type: "string",
    description,
    enum: enums,
  };
}

export function anyOf<const P extends ValueTypes>(items: P[]): AnyOf<P> {
  return {
    anyOf: items,
  };
}

export function string(description: string): StringSchema {
  return {
    type: "string",
    description,
  };
}

export function object<
  P extends Record<string, ValueTypes>,
  const R extends (keyof P)[],
>(properties: P, required: R, description: string): ObjectSchema<P, R> {
  return {
    type: "object",
    description,
    properties,
    required,
  };
}

export function func<const N extends string, P extends ObjectSchema<any, any>>(
  name: N,
  parameters: P,
  description: string,
) {
  return {
    name,
    description,
    parameters,
  };
}

type PartialExceptTheseRequired<T, K extends keyof T> = Pick<Required<T>, K> &
  Partial<T>;

type Decr = [never, 0, 1, 2, 3, 4, 5]; // add to a reasonable amount

export type ExtractValueType<
  T extends ValueTypes,
  L extends number = 5,
> = L extends number
  ? T extends EnumSchema<infer E>
    ? E
    : T extends BooleanSchema
      ? boolean
      : T extends ObjectSchema<infer P, infer R>
        ? ExtractObject<P, R, Decr[L]>
        : T extends StringSchema
          ? string
          : T extends AnyOf<infer P>
            ? ExtractValueType<P, Decr[L]>
            : T extends ArraySchema<infer P>
              ? ExtractValueType<P, Decr[L]>[]
              : never
  : never;

export type ExtractObject<
  T extends Record<string, ValueTypes>,
  P extends (keyof T)[],
  L extends number,
> = PartialExceptTheseRequired<
  {
    [K in keyof T]: ExtractValueType<T[K], L>;
  },
  P[number]
>;
