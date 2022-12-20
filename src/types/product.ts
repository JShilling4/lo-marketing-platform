import type { Category } from "./category";
import type { Employee } from "./employee";
import type { ProductImage } from "./productImage";
import type { Topic } from "./topic";

type Option = {
  id: string;
  value: string;
};

type FormField = {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder: string;
  sortOrder: number;
  value: string;
  options: Option[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  processingTime: number;
  displayDiscover: boolean;
  isDownload: boolean;
  instantAssetPath: string;
  isActive: boolean;
  createdDatetime: string;
  updatedDatetime: string;
  rating: number;
  reviewCount: number;
  orderCount: number;
  category: Category;
  topics: Topic[];
  assignTo: Partial<Employee>;
  secondaryAssignTo: Partial<Employee>;
  productImages: ProductImage[];
  formFields: FormField[];
};
