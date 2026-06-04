import { CodesError } from './codes.error';

export const ErrorRegistry = {
  [CodesError.DATA_INVALID]: { httpStatus: 400 },
  [CodesError.BRANCH_NOT_FOUND]: { httpStatus: 404 },
  [CodesError.EMPLOYEE_NOT_FOUND]: { httpStatus: 404 },
  [CodesError.DUPLICATE_BRANCH]: { httpStatus: 400 },
  [CodesError.DUPLICATE_BRANCH_CODE]: { httpStatus: 400 },
  [CodesError.DUPLICATE_EMPLOYEE]: { httpStatus: 400 },
  [CodesError.EMAIL_ALREADY_EXISTS]: { httpStatus: 400 },
  [CodesError.BRANCH_REFERENCE_INVALID]: { httpStatus: 400 },
  [CodesError.MANAGER_REFERENCE_INVALID]: { httpStatus: 400 },
} as const satisfies Record<
  (typeof CodesError)[keyof typeof CodesError],
  { httpStatus: number }
>;
