import {
    ElementsFilter,
    html,
    repeat,
    slotted,
    when
} from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { Table } from '.';
import type { TableRecord } from './types';
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
                        <${DesignSystem.tagFor(TableHeader)} class="header" style="min-width: ${x => x.minSize}px;>
                            ${x => x.textContent}
                        </${DesignSystem.tagFor(TableHeader)}>
                    `)}
                </div>
            </div>
            <div class="table-viewport" role="rowgroup">
               ${when(x => x.columns.length > 0, html<Table>`
                    ${repeat(x => x.data, html<TableRecord, Table>`
                        <${DesignSystem.tagFor(TableRow)}
                            :data="${x => x}"
                            :columns="${(_, c) => c.parent.columns}"
                        >
                        </${DesignSystem.tagFor(TableRow)}>
                    `)}
                `)}
            </div>
        </div>
        <slot ${slotted({ property: 'columns', filter: isTableColumn() })}></slot>
    </template>
`;
