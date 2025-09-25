import { z } from "zod";

export const validateFormField = (
  schema: z.ZodType,
  field: string | object
) => {
  const result = schema.safeParse(field);

  const _error = result && "error" in result ? result.error : "";
  const errorMessage =
    _error && "issues" in _error ? _error.issues[0].message : "";
  const isValid = !!!errorMessage;
  return { errorMessage, isValid };
};
