import { css } from '@microsoft/fast-element';
import { display } from '@microsoft/fast-foundation';
import { standardPadding } from '../../../theme-provider/design-tokens';

export const styles = css`
    ${display('flex')}

    :host {
        align-self: center;
        margin-left: ${standardPadding};
    }
`;
