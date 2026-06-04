import { CodesError } from './codes.error';

export const ErrorRegistry = {
  [CodesError.PUBLIC_ID_INVALID]: { httpStatus: 400 },
  [CodesError.NAME_REQUIRED]: { httpStatus: 400 },
  [CodesError.CODE_INVALID]: { httpStatus: 400 },
  [CodesError.EMAIL_INVALID]: { httpStatus: 400 },
  [CodesError.PHONE_INVALID]: { httpStatus: 400 },
  [CodesError.ROLE_INVALID]: { httpStatus: 400 },
  [CodesError.BRANCH_ID_INVALID]: { httpStatus: 400 },
  [CodesError.MANAGER_ID_INVALID]: { httpStatus: 400 },
  [CodesError.OPENED_AT_INVALID]: { httpStatus: 400 },
  [CodesError.HIRED_AT_INVALID]: { httpStatus: 400 },
  [CodesError.IS_ACTIVE_INVALID]: { httpStatus: 400 },
  [CodesError.PERMISSION_DENIED]: { httpStatus: 403 },
  [CodesError.BRANCH_ACCESS_DENIED]: { httpStatus: 403 },
  [CodesError.SCOPE_SIEGE_REQUIRED]: { httpStatus: 403 },
  [CodesError.EMPLOYEE_ROLE_ESCALATION_DENIED]: { httpStatus: 403 },
} as const satisfies Record<
  (typeof CodesError)[keyof typeof CodesError],
  { httpStatus: number }
>;
