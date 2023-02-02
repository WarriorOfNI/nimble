import { css } from '@microsoft/fast-element';
import {
    bodyFont,
    bodyFontColor,
    controlLabelFontColor
} from '../../theme-provider/design-tokens';

export const cellStyles = css`
    span {
        font: ${bodyFont};
        color: ${bodyFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-align: end;
        text-overflow: ellipsis;
        width: 100%;
    }

    .placeholder {
        color: ${controlLabelFontColor};
    }
`;
