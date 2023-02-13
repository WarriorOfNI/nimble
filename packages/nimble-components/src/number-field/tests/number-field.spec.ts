import { html } from '@microsoft/fast-element';
import {
    DesignSystem,
    NumberField as FoundationNumberField
} from '@microsoft/fast-foundation';
import { NumberField } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { type Fixture, fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<NumberField>> {
    return fixture<NumberField>(html`
        <nimble-number-field></nimble-number-field>
    `);
}

describe('NumberField', () => {
    it('should have its tag returned by tagFor(FoundationNumberField)', () => {
        expect(DesignSystem.tagFor(FoundationNumberField)).toBe(
            'nimble-number-field'
        );
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-number-field')).toBeInstanceOf(
            NumberField
        );
    });

    describe('increment/decrement buttons', () => {
        let element: NumberField;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should use decrement button label to label the minus button', async () => {
            const label = 'subtract one';
            element.decrementButtonLabel = label;
            await waitForUpdatesAsync();
            await waitForUpdatesAsync();

            const decrementButton = element.shadowRoot!.querySelector('.step-down .step-up-down-button');
            expect(decrementButton!.textContent?.trim()).toEqual(label);
        });

        it('should use decrement button label as the title for the minus button', async () => {
            const label = 'subtract one';
            element.decrementButtonLabel = label;
            await waitForUpdatesAsync();

            const decrementButton = element.shadowRoot!.querySelector('.step-down .step-up-down-button');
            expect(decrementButton!.getAttribute('title')).toBe(label);
        });

        it('should use increment button label to label the plus button', async () => {
            const label = 'add one';
            element.incrementButtonLabel = label;
            await waitForUpdatesAsync();

            const incrementButton = element.shadowRoot!.querySelector('.step-up .step-up-down-button');
            expect(incrementButton!.textContent?.trim()).toEqual(label);
        });

        it('should use increment button label as the title for the plus button', async () => {
            const label = 'add one';
            element.incrementButtonLabel = label;
            await waitForUpdatesAsync();

            const incrementButton = element.shadowRoot!.querySelector('.step-up .step-up-down-button');
            expect(incrementButton!.textContent?.trim()).toEqual(label);
        });
    });
});
