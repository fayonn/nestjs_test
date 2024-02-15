import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

export const generateMock = (component: any) => {
  const moduleMocker = new ModuleMocker(global);
  const mockMetadata = moduleMocker.getMetadata(
    component,
  ) as MockFunctionMetadata<any, any>;
  const Mock = moduleMocker.generateFromMetadata(mockMetadata);
  return new Mock();
};
