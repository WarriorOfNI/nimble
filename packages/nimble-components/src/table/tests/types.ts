export const ExampleDataType = {
    simpleData: 'SimpleData',
    largeData: 'LargeData'
} as const;
export type ExampleDataType =
    typeof ExampleDataType[keyof typeof ExampleDataType];
