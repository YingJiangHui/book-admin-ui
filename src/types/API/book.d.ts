namespace API {
  namespace Book {
    interface Instance {
      id: number;

      title: string;

      author: string;

      categoryId: number;

      publishedYear: number;

      isbn: string;

      available: boolean;

      files: API.File.Instance[];

      description: string;

      libraryId: number;

      isRecommend: boolean;

      isBanner: boolean;
    }
    type CreateParams = Omit<Instance, 'files'> & {
      file: { originFileObj: File }[];
      oldFileIds: number[];
    };
    interface ListParams {}
  }
}
