import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import {
    DisabledState,
    disabledStates,
    matrixThemeWrapper
} from '../../tests/utilities/theme-test-helpers';
import '../index';

const metadata: Meta = {
    title: 'Tests/Tabs',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/b2aa2c0c-03b7-4571-8e0d-de88baf0814b/specs'
        }
    }
};

export default metadata;

const component = ([disabledName, disabled]: DisabledState): string => `
    <nimble-tabs>
        <nimble-tab >Tab One</nimble-tab>
        <nimble-tab ${disabled}>Tab Two ${disabledName}</nimble-tab>
        <nimble-tab-panel>Tab content one</nimble-tab-panel>
        <nimble-tab-panel>Tab content two</nimble-tab-panel>
    </nimble-tabs>
`;

export const selectThemeMatrix: Story = (): string => matrixThemeWrapper(component, [disabledStates]);
