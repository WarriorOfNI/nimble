import { html, repeat } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableRow } from '.';
import { TableCell } from '../cell';
import type { TableColumn } from '../../../table-column/base';

// prettier-ignore
export const template = html<TableRow>`
    <template role="row">
        ${repeat(x => x.columns, html<TableColumn, TableRow>`
            <${DesignSystem.tagFor(TableCell)}
                class="cell"
                :cellTemplate="${x => x.cellTemplate}"
                :cellStyles="${x => x.cellStyles}"
                :data="${(x, c) => c.parent.getCellValue(x)}"
                style="min-width: ${x => x.minSize}px; max-width: ${x => x.maxSize}px; width: ${x => x.size}px;"
            >
            </${DesignSystem.tagFor(TableCell)}>
        `)}
    </template>
`;
