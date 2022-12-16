import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { applicationBackgroundColor, controlHeight, fillHoverColor } from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        height: ${controlHeight};
        background: ${applicationBackgroundColor};
    }

    :host(:hover) {
        background: ${fillHoverColor}
    }

    .cell {
        flex: 1;
    }
`;
