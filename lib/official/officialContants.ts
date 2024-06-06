export type Official = {
  id: string;
  nama: string;
  gender: string;
  position: string;
  contingentId: string;
  contingentName: string;
  image: {
    file?: File;
    downloadUrl: string;
  };
  createdBy: string;
  createdAt: number;
};
