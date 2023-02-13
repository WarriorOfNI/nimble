import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { NumberFieldAppearance } from '../types';

interface NumberFieldArgs {
    label: string;
    value: number;
    step: number;
    min: number;
    max: number;
    appearance: NumberFieldAppearance;
    disabled: boolean;
    errorVisible: boolean;
    errorText: string;
    incrementButtonLabel: string;
    decrementButtonLabel: string;
}

const metadata: Meta<NumberFieldArgs> = {
    title: 'Number Field',
    decorators: [withXD],
    parameters: {
        docs: {
            description: {
                component:
                    'Similar to a single line text box but only used for numeric data. The controls allow the user to increment and decrement the value.'
            }
        },
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/eaa9ee19-4411-4648-b19d-41f61f9a01cf/specs/'
        },
        actions: {
            handles: ['change', 'input']
        }
    },
    render: createUserSelectedThemeStory(html`
        <nimble-number-field
            placeholder="${x => x.label}"
            value="${x => x.value}"
            step="${x => x.step}"
            min="${x => x.min}"
            max="${x => x.max}"
            appearance="${x => x.appearance}"
            ?disabled="${x => x.disabled}"
            ?error-visible="${x => x.errorVisible}"
            error-text="${x => x.errorText}"
            increment-button-label="${x => x.incrementButtonLabel}"
            decrement-button-label="${x => x.decrementButtonLabel}"
        >
            ${x => x.label}
        </nimble-number-field>
    `),
    argTypes: {
        appearance: {
            options: Object.values(NumberFieldAppearance),
            control: { type: 'radio' }
        },
        errorText: {
            name: 'error-text'
        },
        errorVisible: {
            name: 'error-visible'
        },
        incrementButtonLabel: {
            name: 'increment-button-label',
            description: 'Set to a localized label (e.g. `"Increment"`) for the increment button. This provides an accessible name for assistive technologies.'
        },
        decrementButtonLabel: {
            name: 'decrement-button-label',
            description: 'Set to a localized label (e.g. `"Decrement"`) for the decrement button. This provides an accessible name for assistive technologies.'
        }
    },
    args: {
        label: 'default label',
        value: 42,
        step: 1,
        min: -10,
        max: 50,
        appearance: NumberFieldAppearance.underline,
        disabled: false,
        errorVisible: false,
        errorText: 'Value is invalid',
        incrementButtonLabel: 'Increment',
        decrementButtonLabel: 'Decrement'
    }
};

export default metadata;

export const underlineNumberField: StoryObj<NumberFieldArgs> = {
    args: {
        label: 'Underline Number Field',
        appearance: NumberFieldAppearance.underline
    }
};

export const outlineNumberField: StoryObj<NumberFieldArgs> = {
    args: {
        label: 'Outline Number Field',
        appearance: NumberFieldAppearance.outline
    }
};

export const blockNumberField: StoryObj<NumberFieldArgs> = {
    args: {
        label: 'Block Number Field',
        appearance: NumberFieldAppearance.block
    }
};
