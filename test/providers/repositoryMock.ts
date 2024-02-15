export const repositoryMock = (findOneParam?: any, findParams?: any[]) => {
  return {
    findOne: jest.fn(async (...params) => findOneParam),
    create: jest.fn((entity) => entity),
    save: jest.fn(async (entity) => entity),
    find: jest.fn(async (...params) => findParams),
    remove: jest.fn(async (entity) => entity),
  };
};
