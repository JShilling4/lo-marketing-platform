type FilePath = {
  path: string;
  type: string;
};

export type ProductImage = {
  id: string;
  primary: boolean;
  filepaths: FilePath[];
};
