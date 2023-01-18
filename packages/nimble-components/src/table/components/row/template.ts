import { html, repeat, when } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableRow } from '.';
import { TableCell } from '../cell';
import type { TableColumn } from '../../../table-column/base';

// prettier-ignore
export const template = html<TableRow>`
    <template role="row">
        ${repeat(x => x.columns, html<TableColumn, TableRow>`
            <${DesignSystem.tagFor(TableCell)}
                class="cell ${(x, c) => (c.parent.menuIsOpen && (c.parent.currentActionMenuColumn === x) ? 'menu-open' : '')}"
                ?action-menu="${x => !!x.actionMenu}"
                :cellTemplate="${x => x.cellTemplate}"
                :cellStyles="${x => x.cellStyles}"
                :data="${(x, c) => c.parent.getCellState(x)}"
                @cell-action-menu-opening="${(x, c) => c.parent.onCellActionMenuOpening(x)}"
                @cell-action-menu-open-change="${(_, c) => c.parent.onCellActionMenuOpenChange(c.event as CustomEvent)}"
            >
                ${when((x, c) => (c.parent.currentActionMenuColumn === x) && !!x.actionMenu, html<TableColumn, TableRow>`
                    <slot
                        name="${(x, c) => ((c.parent.currentActionMenuColumn === x) ? `row-action-menu-${x.actionMenu!}` : 'nimble-unused-action-menu')}"
                        slot="cellActionMenu"
                    ></slot>
                `)}
            </${DesignSystem.tagFor(TableCell)}>
        `)}
    </template>
`;
