import { html } from '@microsoft/fast-element';
import type { TableColumnTextFormatBaseRecord, TableColumnTextFormatBaseColumnConfig } from '.';
import type { TableCellState } from '../../table/types';

export const cellTemplate = html<
TableCellState<TableColumnTextFormatBaseRecord, TableColumnTextFormatBaseColumnConfig>
>`
    <span
        class="${x => (x.columnConfig.shouldUsePlaceholder(x.cellRecord.value) ? 'placeholder' : '')}"
    >
        ${x => (x.columnConfig.shouldUsePlaceholder(x.cellRecord.value)
        ? x.columnConfig.placeholder
        : x.columnConfig.formatFunction(x.cellRecord.value))}
    </span>
`;
