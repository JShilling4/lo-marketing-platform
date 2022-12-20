import type { Comment } from "./comment";
import type { Employee } from "./employee";
import type { OrderDeliverable } from "./orderDeliverable";
import type { Product } from "./product";

type OrderActivity = {
  id: string;
  datetime: string;
  note: string;
  employee: Employee;
};

type OrderDetailOption = {
  label: string;
  value: string;
};

type OrderDetail = {
  id: string;
  label: string;
  type: string;
  value: string;
  fileName?: string;
  required: boolean;
  sortOrder: number;
  placeholder: string;
  options: OrderDetailOption[];
};

export type Order = {
  id: string;
  product: Product;
  orderedBy: Partial<Employee>;
  orderedFor: Partial<Employee>;
  dueDate: string;
  assignedTo: Employee;
  secondaryAssignTo: Partial<Employee>;
  followers: Employee[];
  orderActivity: OrderActivity[];
  comments: Comment[];
  status: string;
  completedDatetime: string;
  orderedDatetime: string;
  details: OrderDetail[];
  deliverables: OrderDeliverable[];
};
