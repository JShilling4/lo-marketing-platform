import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { Topic } from "@/types/topic";
import type { User } from "@/types/user";

export const allProducts: Product[] = [
  {
    id: "1",
    name: "",
    description: "",
    processingTime: "",
    displayRealtor: false,
    displayDiscover: false,
    isDownload: false,
    isCobrandable: false,
    instantAssetPath: "",
    isActive: true,
    sortOrder: 1,
    createdDatetime: "",
    updatedDatetime: "",
    invoiceValue: "",
    invoiceDescription: "",
    rating: "",
    reviewCount: 1,
    requires3rdParty: false,
    orderCount: 4,
    category: {
      id: "",
      name: "",
    },
    topics: [
      {
        name: "",
      },
    ],
    assignTo: {
      employeeNumber: "",
      fullName: "",
      email: "",
    },
    secondaryAssignTo: {
      employeeNumber: "",
      fullName: "",
      email: "",
    },
    productImages: [
      {
        id: "",
        primary: "",
        filepaths: [
          {
            path: "",
            type: "",
          },
        ],
      },
    ],
    formFields: [
      {
        id: "",
        type: "",
        label: "",
        required: true,
        placeholder: "",
        sortOrder: 1,
        value: "",
        options: [
          {
            id: "",
            value: "",
          },
        ],
      },
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export const allCategories: Category[] = [
  {
    id: "1",
    name: "category1",
    description: "this is category1",
    sortOrder: 1,
    displayRealtor: true,
    isActive: true,
  },
];

export const allTopics: Topic[] = [
  {
    name: "topic1",
    description: "this is topic1",
    isActive: true,
  },
];

export const user: User = {
  employeeNumber: "12345",
  firstName: "John",
  lastName: "Smith",
  fullName: "John Smith",
  position: "Marketing Specialist",
  email: "jsmith@company.com",
  nmls: null,
  userRoles: ["ROLE_MARKETING_EMPLOYEE"],
  cellPhone: "555-555-5555",
  token: "oijweh0-9u-rw9ujrwp0j",
  tokenExpiration: "",
  availability: "",
  awayStartDatetime: null,
  awayEndDatetime: null,
};
