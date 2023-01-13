import {
    ElementsFilter,
    html,
    repeat,
    slotted,
    when
} from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { Table } from '.';
import type { TableRowState } from './types';
import { TableHeader } from './components/header';
import { TableRow } from './components/row';
import { TableColumn } from '../table-column/base';

const isTableColumn = (): ElementsFilter => {
    const filter: ElementsFilter = (
        value: Node,
        _: number,
        __: Node[]
    ): boolean => {
        return value instanceof TableColumn;
    };
    return filter;
};

// prettier-ignore
export const template = html<Table>`
    <template role="table">
        <div class="table-container">
            <div role="rowgroup" class="header-container">
                <div class="header-row" role="row">
                    ${repeat(x => x.columns, html<TableColumn>`
                        <${DesignSystem.tagFor(TableHeader)} class="header">
                            ${x => x.textContent}
                        </${DesignSystem.tagFor(TableHeader)}>
                    `)}
                </div>
            </div>
            <div class="table-viewport" role="rowgroup">
            ${when(x => x.columns.length > 0, html<Table>`
                ${repeat(x => x.tableData, html<TableRowState, Table>`
                    <${DesignSystem.tagFor(TableRow)}
                        row-id="${x => x.id}"
                        :data="${x => x.data}"
                        :columns="${(_, c) => c.parent.columns}"
                        @row-action-menu-opening="${(_, c) => c.parent.onRowActionMenuOpening(c.event as CustomEvent)}"
                    >
                    <slot name="${(x, c) => ((c.parent.openActionMenuRowId === x.id) ? 'actionMenu' : 'unused_actionMenu')}" slot="rowActionMenu"></slot>
                    </${DesignSystem.tagFor(TableRow)}>
                `)}
            `)}
            </div>
        </div>
        <slot ${slotted({ property: 'columns', filter: isTableColumn() })}></slot>
    </template>
`;
