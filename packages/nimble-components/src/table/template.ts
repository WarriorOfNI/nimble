import {
    ElementsFilter,
    html,
    ref,
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
import { TableColumnSizeHelper } from './models/table-column-size-helper';

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
                <div class="header-row" ${ref('rowHeader')} role="row" style="grid-template-columns: ${x => TableColumnSizeHelper.getTemplateColumns(x.columns)};">
                    ${repeat(x => x.columns, html<TableColumn, Table>`
                        <${DesignSystem.tagFor(TableHeader)} class="header" style="min-width: ${x => x.currentMinWidth}px;">
                            ${when((_, c) => c.index > 0, html`
                                <div class="column-divider left" @mousedown="${(_, c) => (c.parent as Table).onDividerMouseDown(c.index - 1)}"></div>
                            `)}
                            <div class="header-content">
                                ${x => x.textContent}
                            </div>
                            ${when((_, c) => c.index < c.parent.columns.length - 1, html`
                                <div class="column-divider right" @mousedown="${(_, c) => (c.parent as Table).onDividerMouseDown(c.index)}"></div>
                            `)}
                        </${DesignSystem.tagFor(TableHeader)}>
                    `, { positioning: true })}
                </div>
            </div>
            <div class="table-viewport" role="rowgroup">
            ${when(x => x.columns.length > 0, html<Table>`
                ${repeat(x => x.tableData, html<TableRowState>`
                    <${DesignSystem.tagFor(TableRow)}
                        :data="${x => x.data}"
                        :columns="${(_, c) => (c.parent as Table).columns}"
                    >
                    </${DesignSystem.tagFor(TableRow)}>
                `)}
            `)}
            </div>
        </div>
        <slot ${slotted({ property: 'columns', filter: isTableColumn() })}></slot>
    </template>
`;

