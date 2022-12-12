import { graphql, rest } from "./clients";
import type { IProductRepository } from "@/types/repositories/productRepository";

export const productRepository: IProductRepository = {
  getAll() {
    return graphql.post("/graphql", {
      query: `{
        marketingV1GetProduct(id: null) {
          id
          name
          description
          processingTime
          displayRealtor
          displayDiscover
          isDownload
          isCobrandable
          instantAssetPath
          isActive
          sortOrder
          createdDatetime
          updatedDatetime
          invoiceValue
          invoiceDescription
          rating
          reviewCount
          requires3rdParty
          orderCount
          category {
            id
            name
          }
          topics {
            name
          }
          assignTo {
            employeeNumber
            fullName
            email
          }
          secondaryAssignTo {
            employeeNumber
            fullName
            email
          }
          productImages {
            id
            primary
            filepaths {
                path
                type
            }
          }
          formFields {
            id
            type
            label
            required
            sortOrder
            placeholder
            value
            options {
                id
                value
            }
          }
        }
      }`,
    });
  },

  get(id) {
    return graphql.post("/graphql", {
      query: `{
        marketingV1GetProduct(id: "${id}"){
          id
          name
          description
          processingTime
          displayRealtor
          displayDiscover
          isDownload
          isCobrandable
          instantAssetPath
          isActive
          sortOrder
          createdDatetime
          updatedDatetime
          invoiceValue
          invoiceDescription
          rating
          reviewCount
          requires3rdParty
          orderCount
          category {
            id
            name
          }
          topics {
            name
          }
          assignTo {
            employeeNumber
            fullName
            email
          }
          secondaryAssignTo {
            employeeNumber
            fullName
            email
          }
          productImages {
            id
            primary
              filepaths {
                path
                type
              }
            }
          formFields {
            id
            type
            label
            required
            placeholder
            sortOrder
            value
            options {
                id
                value
            }
          }
        }
      }`,
    });
  },

  post(payload) {
    return rest.post("/v1/manageProduct", payload);
  },

  bulkPost(payload) {
    return rest.post("/v1/manageBulkProducts", payload);
  },
};
