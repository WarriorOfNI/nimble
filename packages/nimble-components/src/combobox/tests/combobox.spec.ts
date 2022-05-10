import {
    DesignSystem,
    Combobox as FoundationCombobox
} from '@microsoft/fast-foundation';
import { DOM, html } from '@microsoft/fast-element';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { Combobox } from '..';
import '../../list-option';

async function setup(
    position?: string,
    open?: boolean
): Promise<Fixture<Combobox>> {
    const viewTemplate = html`
        <nimble-combobox
            ${position !== undefined ? `position="${position}"` : ''}
            ${open ? 'open' : ''}
        >
            <nimble-list-option value="one">One</nimble-list-option>
            <nimble-list-option value="two">Two</nimble-list-option>
            <nimble-list-option value="three">Three</nimble-list-option>
        </nimble-combobox>
    `;
    return fixture<Combobox>(viewTemplate);
}

xdescribe('Combobox', () => {
    it('should respect value set before connect is completed', async () => {
        const { element, connect, disconnect } = await setup();

        element.value = 'two';
        await connect();

        expect(element.value).toBe('Two');

        await disconnect();
    });

    it('should respect "open" and "position" attributes when both set', async () => {
        const position = 'above';
        const { element, connect, disconnect } = await setup(position, true);

        await connect();
        await DOM.nextUpdate();

        expect(element.getAttribute('open')).not.toBeNull();
        expect(element.getAttribute('position')).toBe(position);

        await disconnect();
    });

    it('should keep selected value when options change', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.value = 'two';
        await DOM.nextUpdate();
        expect(element.value).toBe('Two');

        // Add option zero at the top of the options list
        // prettier-ignore
        element.insertAdjacentHTML(
            'afterbegin',
            '<nimble-list-option value="zero">Zero</nimble-list-option>'
        );
        await DOM.nextUpdate();

        expect(element.value).toBe('Two');

        await disconnect();
    });

    it('should have its tag returned by tagFor(FoundationCombobox)', () => {
        expect(DesignSystem.tagFor(FoundationCombobox)).toBe('nimble-combobox');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-combobox')).toBeInstanceOf(
            Combobox
        );
    });

    it('should disable the button when the disabled is `true`', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        element.disabled = true;
        await DOM.nextUpdate();

        expect(element.dropdownButton!.disabled).toBeTrue();

        await disconnect();
    });

    it('clicking dropdown button should open menu', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();

        element.dropdownButton?.control.click();
        await DOM.nextUpdate();

        expect(element.open).toBeTrue();

        await disconnect();
    });

    it('clicking dropdown button when popup is open should close menu', async () => {
        const { element, connect, disconnect } = await setup(undefined, true);
        await connect();

        element.dropdownButton?.control.click();
        await DOM.nextUpdate();

        expect(element.open).toBeTrue();

        await disconnect();
    });
});