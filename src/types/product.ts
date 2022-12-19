export type Product = {
  id: string;
  name: string;
  description: string;
  processingTime: string;
  displayDiscover: boolean;
  isDownload: boolean;
  instantAssetPath: string;
  isActive: boolean;
  createdDatetime: string;
  updatedDatetime: string;
  rating: string;
  reviewCount: number;
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
      primary: boolean;
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
