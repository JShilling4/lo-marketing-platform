type Asset = {
  id: string;
  filepath: string;
  type: string;
};

export type Version = {
  id: string;
  filepath: string;
  datetime: string;
};

export type OrderDeliverable = {
  id: string;
  status: string;
  filepath?: string;
  createdDatetime: string;
  assets: Asset | null;
  versions: Version | null;
};
