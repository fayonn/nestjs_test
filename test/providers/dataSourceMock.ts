export const dataSourceMock = () => {
  return {
    initialize: jest.fn(),
    createEntityManager: jest.fn(),
  };
};
