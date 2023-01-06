import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import type { Topic } from "@/types/topic";
import type { User } from "@/types/user";

export const allProducts: Product[] = [
  {
    id: "1",
    name: "Business Brochure",
    description: "",
    processingTime: 60,
    displayDiscover: false,
    isDownload: false,
    instantAssetPath: "",
    isActive: true,
    createdDatetime: "",
    updatedDatetime: "",
    rating: 4,
    reviewCount: 1,
    orderCount: 4,
    category: {
      id: "1",
      name: "Brochures",
      description: "",
      isActive: true,
    },
    topics: [],
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
        id: "1",
        primary: true,
        filepaths: [
          {
            path: "https://media.istockphoto.com/id/1203085103/vector/business-brochure-flyer-design-template.jpg?s=612x612&w=is&k=20&c=akRE-_KFi8UbAZHghzOGn_YvdZtzlN9LZHDKXjmmcRU=",
            type: "preview",
          },
          {
            path: "https://media.istockphoto.com/id/1203085103/vector/business-brochure-flyer-design-template.jpg?s=612x612&w=is&k=20&c=akRE-_KFi8UbAZHghzOGn_YvdZtzlN9LZHDKXjmmcRU=",
            type: "thumbnail",
          },
          {
            path: "https://media.istockphoto.com/id/1203085103/vector/business-brochure-flyer-design-template.jpg?s=612x612&w=is&k=20&c=akRE-_KFi8UbAZHghzOGn_YvdZtzlN9LZHDKXjmmcRU=",
            type: "fullscreen",
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
  {
    id: "2",
    name: "Book Cover",
    description: "",
    processingTime: 120,
    displayDiscover: false,
    isDownload: false,
    instantAssetPath: "",
    isActive: true,
    createdDatetime: "",
    updatedDatetime: "",
    rating: 2,
    reviewCount: 1,
    orderCount: 4,
    category: {
      id: "2",
      name: "Book Covers",
      description: "",
      isActive: true,
    },
    topics: [],
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
        id: "1",
        primary: true,
        filepaths: [
          {
            path: "https://media.istockphoto.com/id/1208808758/vector/city-background-business-book-cover-design-template.jpg?s=612x612&w=is&k=20&c=Co7Hkx3rOTDKB42xOsnPyKWUQBZ-xCLS2sZHRcX3r_E=",
            type: "preview",
          },
          {
            path: "https://media.istockphoto.com/id/1208808758/vector/city-background-business-book-cover-design-template.jpg?s=612x612&w=is&k=20&c=Co7Hkx3rOTDKB42xOsnPyKWUQBZ-xCLS2sZHRcX3r_E=",
            type: "thumbnail",
          },
          {
            path: "https://media.istockphoto.com/id/1208808758/vector/city-background-business-book-cover-design-template.jpg?s=612x612&w=is&k=20&c=Co7Hkx3rOTDKB42xOsnPyKWUQBZ-xCLS2sZHRcX3r_E=",
            type: "fullscreen",
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
  {
    id: "3",
    name: "Club Flyer",
    description:
      "Specialized flyer for club events. Provide the required fields and additional details can be discussed in the order.",
    processingTime: 40,
    displayDiscover: false,
    isDownload: false,
    instantAssetPath: "",
    isActive: true,
    createdDatetime: "",
    updatedDatetime: "",
    rating: 5,
    reviewCount: 1,
    orderCount: 4,
    category: {
      id: "3",
      name: "Flyers",
      description: "",
      isActive: true,
    },
    topics: [],
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
        id: "1",
        primary: true,
        filepaths: [
          {
            path: "https://freepsdflyer.com/wp-content/uploads/2021/02/Free-Night-Club-Party-PSD-Flyer-Template.jpg",
            type: "preview",
          },
          {
            path: "https://freepsdflyer.com/wp-content/uploads/2021/02/Free-Night-Club-Party-PSD-Flyer-Template.jpg",
            type: "thumbnail",
          },
          {
            path: "https://freepsdflyer.com/wp-content/uploads/2021/02/Free-Night-Club-Party-PSD-Flyer-Template.jpg",
            type: "fullScreen",
          },
        ],
      },
    ],
    formFields: [
      {
        id: "1",
        type: "text",
        label: "Club name",
        required: true,
        placeholder: "Enter club name...",
        sortOrder: 1,
        value: "",
        options: [],
      },
      {
        id: "2",
        type: "text",
        label: "Website link",
        required: false,
        placeholder: "",
        sortOrder: 1,
        value: "",
        options: [],
      },
      {
        id: "3",
        type: "textbox",
        label: "Event description",
        required: true,
        placeholder: "",
        sortOrder: 1,
        value: "",
        options: [],
      },
    ],
  },
  {
    id: "4",
    name: "Yard Signage",
    description: "Customizable marketing or event yard signage ",
    processingTime: 240,
    displayDiscover: false,
    isDownload: false,
    instantAssetPath: "",
    isActive: true,
    createdDatetime: "",
    updatedDatetime: "",
    rating: 4,
    reviewCount: 1,
    orderCount: 4,
    category: {
      id: "4",
      name: "Signage",
      description: "",
      isActive: true,
    },
    topics: [],
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
        id: "1",
        primary: true,
        filepaths: [
          {
            path: "https://cms-assets.tutsplus.com/cdn-cgi/image/width=850/uploads/users/2659/posts/34618/image-upload/Classic%20Yard%20Sale%20Flyer%20Template-intro.jpg",
            type: "preview",
          },
          {
            path: "https://cms-assets.tutsplus.com/cdn-cgi/image/width=850/uploads/users/2659/posts/34618/image-upload/Classic%20Yard%20Sale%20Flyer%20Template-intro.jpg",
            type: "thumbnail",
          },
          {
            path: "https://cms-assets.tutsplus.com/cdn-cgi/image/width=850/uploads/users/2659/posts/34618/image-upload/Classic%20Yard%20Sale%20Flyer%20Template-intro.jpg",
            type: "fullscreen",
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
  {
    id: "5",
    name: "Business Card 1",
    description: "",
    processingTime: 300,
    displayDiscover: false,
    isDownload: false,
    instantAssetPath: "",
    isActive: true,
    createdDatetime: "",
    updatedDatetime: "",
    rating: 3,
    reviewCount: 1,
    orderCount: 4,
    category: {
      id: "5",
      name: "Business Cards",
      description: "",
      isActive: true,
    },
    topics: [],
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
        id: "1",
        primary: true,
        filepaths: [
          {
            path: "https://d2tl9ctlpnidkn.cloudfront.net/hlsonprint/images/product/business-cards-printing8847.jpg",
            type: "preview",
          },
          {
            path: "https://d2tl9ctlpnidkn.cloudfront.net/hlsonprint/images/product/business-cards-printing8847.jpg",
            type: "thumbnail",
          },
          {
            path: "https://d2tl9ctlpnidkn.cloudfront.net/hlsonprint/images/product/business-cards-printing8847.jpg",
            type: "fullscreen",
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
  {
    id: "6",
    name: "Social Media Banner",
    description: "",
    processingTime: 360,
    displayDiscover: false,
    isDownload: false,
    instantAssetPath: "",
    isActive: true,
    createdDatetime: "",
    updatedDatetime: "",
    rating: 3,
    reviewCount: 1,
    orderCount: 4,
    category: {
      id: "6",
      name: "Social Media Banners",
      description: "",
      isActive: true,
    },
    topics: [],
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
        id: "1",
        primary: true,
        filepaths: [
          {
            path: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5c913c101281739.5f1b0a1e449a2.jpg",
            type: "preview",
          },
          {
            path: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5c913c101281739.5f1b0a1e449a2.jpg",
            type: "thumbnail",
          },
          {
            path: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5c913c101281739.5f1b0a1e449a2.jpg",
            type: "fullscreen",
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
  {
    id: "7",
    name: "Emails",
    description: "",
    processingTime: 420,
    displayDiscover: false,
    isDownload: false,
    instantAssetPath: "",
    isActive: true,
    createdDatetime: "",
    updatedDatetime: "",
    rating: 4,
    reviewCount: 1,
    orderCount: 4,
    category: {
      id: "7",
      name: "Email Templates",
      description: "",
      isActive: true,
    },
    topics: [],
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
        id: "1",
        primary: true,
        filepaths: [
          {
            path: "https://static.wixstatic.com/media/311dce_1f75acc705854545b16dd1e2a2a4ac8a~mv2.png/v1/fill/w_640,h_560,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/311dce_1f75acc705854545b16dd1e2a2a4ac8a~mv2.png",
            type: "preview",
          },
          {
            path: "https://static.wixstatic.com/media/311dce_1f75acc705854545b16dd1e2a2a4ac8a~mv2.png/v1/fill/w_640,h_560,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/311dce_1f75acc705854545b16dd1e2a2a4ac8a~mv2.png",
            type: "thumbnail",
          },
          {
            path: "https://static.wixstatic.com/media/311dce_1f75acc705854545b16dd1e2a2a4ac8a~mv2.png/v1/fill/w_640,h_560,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/311dce_1f75acc705854545b16dd1e2a2a4ac8a~mv2.png",
            type: "fullscreen",
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
    name: "Brochures",
    description: "Business brochures",
    isActive: true,
  },
  {
    id: "2",
    name: "Book Covers",
    description: "Book covers covering a wide range of styles",
    isActive: true,
  },
  {
    id: "3",
    name: "Flyers",
    description: "Event flyers",
    isActive: true,
  },
  {
    id: "4",
    name: "Signage",
    description: "Yard signage for various events & occasions",
    isActive: true,
  },
  {
    id: "5",
    name: "Business Cards",
    description: "Business cards for companies & individuals",
    isActive: true,
  },
  {
    id: "6",
    name: "Social Media Banners",
    description: "Social media banners for facebook, instagram, twitter, etc.",
    isActive: true,
  },
  {
    id: "7",
    name: "Email Templates",
    description: "Email templates to cover any target",
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
  userRoles: ["ROLE_EMPLOYEE"],
  cellPhone: "555-555-5555",
  token: "oijweh0-9u-rw9ujrwp0j",
  tokenExpiration: "",
  availability: "",
  awayStartDatetime: null,
  awayEndDatetime: null,
};
