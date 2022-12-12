import type { AxiosResponse } from "axios";
import type { IProduct } from "../product";

export interface IProductRepository {
  getAll(): Promise<AxiosResponse<any, any>>;
  get(id: string): Promise<AxiosResponse<any, any>>;
  post(data: IProduct): Promise<AxiosResponse<any, any>>;
  bulkPost(data: IProduct[]): Promise<AxiosResponse<any, any>>;
}
