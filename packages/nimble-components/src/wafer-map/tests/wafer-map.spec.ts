import { html } from '@microsoft/fast-element';
import { WaferMap } from '..';
import type { WaferMapRenderingObject } from '../data-types/WaferMapRenderingObject';
import { WaferMapColorsScale } from '../data-types/WafermapColorsScale';
import { WaferMapDataType, Orientation, Quadrant } from '../types';
import { fixture, Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<WaferMap>> {
    return fixture<WaferMap>(
        html`<nimble-wafer-map></nimble-wafer-map>`
    );
}

function getWafermapRenderingObject(): WaferMapRenderingObject {
    return {
        dice: [
            { data: '1', x: 2, y: 1 },
            { data: '2', x: 2, y: 2 },
            { data: '3', x: 2, y: 3 },
            { data: '4', x: 2, y: 4 },
            { data: '5', x: 3, y: 1 },
            { data: '6', x: 3, y: 2 },
            { data: '7', x: 3, y: 3 },
            { data: '8', x: 3, y: 4 },
            { data: '9', x: 3, y: 5 },
            { data: '10', x: 4, y: 1 },
            { data: '11', x: 4, y: 2 },
            { data: '12', x: 4, y: 3 },
            { data: '13', x: 4, y: 4 },
            { data: '14', x: 4, y: 5 },
            { data: '15', x: 5, y: 1 },
            { data: '16', x: 5, y: 2 },
            { data: '16', x: 5, y: 3 },
            { data: '14', x: 5, y: 4 },
            { data: '14', x: 5, y: 5 },
            { data: '14', x: 5, y: 6 },
        ],
        metadata: {
            axisLocation: Quadrant.topLeft,
            notchOrientation: Orientation.right,
            cols: 6,
            rows: 6,
            origin: { x: 1, y: 1 }
        },
        maxCharacters: 4,
        waferDataType: WaferMapDataType.accumulative,
        colorsScale: [],
        isEmpty: false
    };
}

describe('WaferMap', () => {
    let element: WaferMap;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        // debugger;
        expect(document.createElement('nimble-wafer-map')).toBeInstanceOf(
            WaferMap
        );
    });

    fit('can send data to inputs', async () => {
        element.waferData = getWafermapRenderingObject();
        element.colorsScale = new WaferMapColorsScale(['red', 'blue', 'green'], ['1', '2', '3']);
        await connect();
        // debugger;
    });
});
