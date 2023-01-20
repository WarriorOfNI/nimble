import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { bodyFont, bodyFontColor, controlHeight, standardPadding } from '../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    .table-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        font: ${bodyFont};
        color: ${bodyFontColor};
        overflow: auto;
    }

    .header-container {
        position: sticky;
        top: 0;
    }

    .header-row {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
    }

    .header {
        display: flex;
    }

    .header:hover .column-divider.left,
    .header:hover .column-divider.right {
        display: block;
    }

    .header-content {
        flex: 1;
        padding: 0px calc(${standardPadding} / 2);
    }

    .column-divider {
        border-left: 2px solid;
        display: none;
        height: ${controlHeight};
        cursor: col-resize;
    }

    .left { 
        margin: -1px;
    }

    .right { 
        margin: 1px;
    }
`;
