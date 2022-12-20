import type { Employee } from "./employee";

export type Comment = {
  id: string;
  comment: string;
  isAdmin: boolean;
  datetime: string;
  filepath: string;
  employee: Employee;
};
