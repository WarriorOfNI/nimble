import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { ExampleDataType } from './types';
import { bodyFont } from '../../theme-provider/design-tokens';
import type { Table } from '..';

interface TableArgs {
    data: ExampleDataType;
    idFieldName: undefined;
    validity: undefined;
    checkValidity: undefined;
    tableRef: Table;
    updateData: (args: TableArgs) => void;
}

const formatFunction = (x: number): string => `${x} years`;

const simpleData = [
    {
        firstName: 'Ralph',
        lastName: 'Wiggum',
        favoriteColor: 'Rainbow',
        age: 12
    },
    {
        firstName: 'Milhouse',
        lastName: 'Van Houten',
        favoriteColor: 'Crimson',
        age: 11
    },
    {
        firstName: 'Ned',
        lastName: 'Flanders',
        favoriteColor: 'Taupe',
    }
] as const;

const firstNames = ['John', 'Sally', 'Joe', 'Michael', 'Sam'];
const lastNames = ['Davidson', 'Johnson', 'Abraham', 'Wilson'];
const colors = ['Red', 'Blue', 'Green', 'Yellow'];
const largeData = [];
for (let i = 0; i < 10000; i++) {
    largeData.push({
        id: i.toString(),
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        favoriteColor: colors[i % colors.length],
        age: i / 125
    });
}

const dataSets = {
    [ExampleDataType.simpleData]: simpleData,
    [ExampleDataType.largeDataSet]: largeData
} as const;

const dataSetIdFieldNames = {
    [ExampleDataType.simpleData]: 'firstName',
    [ExampleDataType.largeDataSet]: 'id'
} as const;

const overviewText = 'The `nimble-table` is a component that offers a way to render tabular data in a variety of ways in each column.';

const dataDescription = `To set the data on the table, call \`setData()\` with an array data records. Each record is made up of fields,
which are key/value pairs. The key in each pair must be of type \`string\`, which is defined by the type \`TableFieldName\`. The value
in each pair must be of type \`string\`, \`number\`, \`boolean\`, \`null\`, or \`undefined\`, which is defined by the type \`TableFieldValue\`.

The table will not automatically update if the contents of the array change after calling \`setData()\`. To trigger an update, call
\`setData()\` again with the same array reference or with a new array.

<details>
    <summary>Framework specific considerations</summary>
    - Angular: In addition to exposing the \`setData()\` function in Angular, you can use the \`data$\` property to provide an
    \`Observable<TableRecord[]>\`. Nimble will automatically subscribe and unsubscribe to the provided \`Observable\` and call
    \`setData()\` on the web component when new values are emitted.
    - Blazor: Blazor does not expose a \`setData()\` function. Use the \`Data\` property on the Blazor component to set new data on the table.
    Setting a new value on the property in Blazor will internally call \`setData()\` on the web component.
</details>
`;

const idFieldNameDescription = `An optional string attribute that specifies the field name within a row's record to use as a row's ID.
If the attribute is not specified, a default ID will be generated. If the attribute is invalid, no rows in the table will be rendered,
and the table will enter an invalid state according to the \`validity\` property and \`checkValidity()\` function.

The attribute is invalid in the following conditions:
-   Multiple records were found with the same ID. This will cause \`validity.duplicateRecordId\` to be \`true\`.
-   A record was found that did not have a field with the name specified by \`id-field-name\`. This will cause \`validity.missingRecordId\` to be \`true\`.
-   A record was found where \`id-field-name\` did not refer to a value of type \`string\`. This will cause \`validity.invalidRecordId\` to be \`true\`.`;

const validityDescription = `Readonly object of boolean values that represents the validity states that the table's configuration can be in.
The object's type is \`TableValidityState\`, and it contains the following boolean properties:

-   \`duplicateRecordId\`: \`true\` when multiple records were found with the same ID
-   \`missingRecordId\`: \`true\` when a record was found that did not have a field with the name specified by \`id-field-name\`
-   \`invalidRecordId\`: \`true\` when record was found where \`id-field-name\` did not refer to a value of type \`string\`
`;

const metadata: Meta<TableArgs> = {
    title: 'Table',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component: overviewText
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/'
        },
        actions: {
            handles: []
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html<TableArgs>`
        <div id="usage-warning">
            WARNING - The table is still in development and considered
            experimental. It is not recommended for application use.
        </div>
        <nimble-table
            ${ref('tableRef')}
            id-field-name="${x => dataSetIdFieldNames[x.data]}"
            data-unused="${x => x.updateData(x)}"
        >
            <nimble-table-column-text field-name="firstName" placeholder="no value">First Name</nimble-table-column-text>
            <nimble-table-column-text field-name="lastName" placeholder="no value">Last Name</nimble-table-column-text>
            <nimble-table-column-number field-name="age" placeholder="Unknown">Age</nimble-table-column-number>
            <nimble-table-column-text field-name="favoriteColor" placeholder="no value">Favorite Color</nimble-table-column-text>
        </nimble-table>
        <style class="code-hide">
            #usage-warning {
                color: red;
                font: var(${bodyFont.cssCustomProperty});
            }
        </style>
    `),
    argTypes: {
        data: {
            name: 'setData(data)',
            description: dataDescription,
            options: Object.values(ExampleDataType),
            control: {
                type: 'radio',
                labels: {
                    [ExampleDataType.simpleData]: 'Simple data',
                    [ExampleDataType.largeDataSet]: 'Large data set (10k rows)'
                }
            }
        },
        idFieldName: {
            name: 'id-field-name',
            table: {
                defaultValue: { summary: 'undefined' }
            },
            description: idFieldNameDescription,
            control: false
        },
        validity: {
            description: validityDescription,
            control: false
        },
        checkValidity: {
            name: 'checkValidity()',
            description:
                'A function that returns `true` if the configuration of the table is valid and `false` if the configuration of the table is not valid.',
            control: false
        },
        tableRef: {
            table: {
                disable: true
            }
        },
        updateData: {
            table: {
                disable: true
            }
        }
    },
    args: {
        data: ExampleDataType.simpleData,
        idFieldName: undefined,
        validity: undefined,
        checkValidity: undefined,
        tableRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-table');
                x.tableRef.setData(dataSets[x.data]);
            })();
        }
    }
};

export default metadata;

export const table: StoryObj<TableArgs> = {};
