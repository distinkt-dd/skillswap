// api/applicationValidate.ts
import * as yup from 'yup';

export const updateApplicationStatusSchema = yup.object({
  status: yup.string().oneOf(['ACCEPTED', 'REJECTED'], 'Недопустимый статус').required(),
});
