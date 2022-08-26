import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { createUserSelectedThemeStory } from '../../utilities/tests/storybook';
import '../../all-components';
import { NumberFieldAppearance } from '../types';

interface NumberFieldArgs {
    label: string;
    value: number;
    appearance: NumberFieldAppearance;
    disabled: boolean;
    invalid: boolean;
    'error-text': string;
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
            appearance="${x => x.appearance}"
            ?disabled="${x => x.disabled}"
            class="${x => (x.invalid ? 'invalid' : '')}"
            error-text="${x => x['error-text']}"
        >
            ${x => x.label}
        </nimble-number-field>
    `),
    argTypes: {
        appearance: {
            options: Object.values(NumberFieldAppearance),
            control: { type: 'radio' }
        }
    },
    args: {
        label: 'default label',
        value: 42,
        appearance: NumberFieldAppearance.underline,
        disabled: false,
        invalid: false,
        'error-text': 'Value is invalid'
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
