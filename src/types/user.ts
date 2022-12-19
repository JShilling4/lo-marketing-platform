export type User = {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  email: string;
  nmls: string | null;
  userRoles: string[];
  cellPhone: string;
  token: string;
  tokenExpiration: string;
  availability: string;
  awayStartDatetime: string | null;
  awayEndDatetime: string | null;
};
