import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import {
    applicationBackgroundColor,
    borderWidth,
    controlHeight,
    fillHoverColor,
    tableRowBorderColor
} from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('grid')}

    :host {
        height: ${controlHeight};
        background: ${applicationBackgroundColor};
        border-top: calc(2 * ${borderWidth}) solid ${tableRowBorderColor};
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
    }

    :host(:hover) .cell {
        background: ${fillHoverColor};
    }

    nimble-table-cell::part(action-menu) {
        display: none;
    }

    nimble-table-cell.menu-open::part(action-menu) {
        display: initial;
    }

    :host(:hover) nimble-table-cell::part(action-menu) {
        display: initial;
    }
`;
