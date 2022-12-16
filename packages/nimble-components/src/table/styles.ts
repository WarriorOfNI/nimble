import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { applicationBackgroundColor, bodyFont, bodyFontColor, controlHeight, standardPadding, tableHeaderFont, tableHeaderFontColor } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    .table-container {
        width: 100%;
        height: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
    }

    .table-header {
        display: flex;
        flex-direction: row;
        font: ${tableHeaderFont};
        color: ${tableHeaderFontColor};
        text-transform: uppercase;
        height: ${controlHeight};
        background: ${applicationBackgroundColor};
    }

    .table-cell {
        flex: 1;
    }

    .table-cell[role="columnheader"] {
        margin-left: ${standardPadding};
        align-self: center;
    }

    .table-viewport {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-top: 2px;
    }
`;
