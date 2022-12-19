export type Product = {
  id: string;
  name: string;
  description: string;
  processingTime: string;
  displayRealtor: boolean;
  displayDiscover: boolean;
  isDownload: boolean;
  isCobrandable: boolean;
  instantAssetPath: string;
  isActive: boolean;
  sortOrder: number;
  createdDatetime: string;
  updatedDatetime: string;
  invoiceValue: string;
  invoiceDescription: string;
  rating: string;
  reviewCount: number;
  requires3rdParty: boolean;
  orderCount: number;
  category: {
    id: string;
    name: string;
  };
  topics: [
    {
      name: string;
    }
  ];
  assignTo: {
    employeeNumber: string;
    fullName: string;
    email: string;
  };
  secondaryAssignTo: {
    employeeNumber: string;
    fullName: string;
    email: string;
  };
  productImages: [
    {
      id: string;
      primary: string;
      filepaths: [
        {
          path: string;
          type: string;
        }
      ];
    }
  ];
  formFields: [
    {
      id: string;
      type: string;
      label: string;
      required: boolean;
      placeholder: string;
      sortOrder: number;
      value: string;
      options: [
        {
          id: string;
          value: string;
        }
      ];
    }
  ];
};
