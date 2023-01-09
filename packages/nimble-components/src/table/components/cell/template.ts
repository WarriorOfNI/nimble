import { html, ref } from '@microsoft/fast-element';
import type { TableCell } from '.';

// prettier-ignore
export const template = html<TableCell>`
    <template role="cell">
        <div ${ref('cellContainer')} class="cell-container"></div>
    </template>
`;
