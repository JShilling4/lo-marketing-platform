import { graphql, rest } from "./clients";

export const productReviewRepository = {
  getAll(productId: any) {
    return graphql.post("/graphql", {
      query: `{
        marketingV1GetProductReview(
          employeeNumber: null,
          productId: ${productId}
        ) {
            rating
            comment
            datetime
            employee {
              fullName
              employeeNumber
            }
            product {
              id
            }
        }
      }`,
    });
  },

  get(data: any) {
    return graphql.post("/graphql", {
      query: `{
        marketingV1GetProductReview(
          employeeNumber: ${data.employeeId},
          productId: ${data.productId}
        ) {
            rating
            comment
        }
      }`,
    });
  },

  post(data: any) {
    return rest.post("/v1/manageProductReview", data);
  },

  delete(data: any) {
    return rest.delete(
      `/v1/deleteProductReview/${data.employeeNumber}/${data.productId}`
    );
  },
};
