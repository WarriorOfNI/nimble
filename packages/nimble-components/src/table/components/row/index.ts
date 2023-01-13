import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { TableCellState, TableRecord } from '../../types';
import type { TableColumn } from '../../../table-column/base';
import type { TableCell } from '../cell';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
}

/**
 * The type of the detail emitted from an action menu opening
 * event.
 */
export interface ActionMenuOpeningEventDetail {
    rowId: string;
    columnId?: string;
}

/**
 * A styled row that is used within the nimble-table.
 * @internal
 */
export class TableRow<
    TData extends TableRecord = TableRecord
> extends FoundationElement {
    @observable
    public data?: TData;

    @observable
    public columns: TableColumn[] = [];

    @attr({ attribute: 'row-id' })
    public rowId = '';

    @observable
    public currentActionMenuColumn?: TableColumn;

    @observable
    public menuIsOpen = false;

    public getCellState(column: TableColumn): TableCellState<TableRecord> {
        const fieldNames = column.getRecordFieldNames();
        if (this.hasValidFieldNames(fieldNames) && this.data) {
            const cellDataValues = fieldNames.map(field => this.data![field]);
            const cellData = Object.fromEntries(
                column.cellStateDataFieldNames.map((k, i) => [
                    k,
                    cellDataValues[i]
                ])
            );
            const columnConfig = column.getColumnConfig?.() ?? {};
            const cellState: TableCellState<TableRecord> = {
                data: cellData,
                columnConfig
            };
            return cellState;
        }

        return { data: {}, columnConfig: {} };
    }

    public onCellActionMenuOpening(column: TableColumn): void {
        this.currentActionMenuColumn = column;
        const detail: ActionMenuOpeningEventDetail = {
            rowId: this.rowId,
            columnId: column.columnId
        };
        this.$emit('row-action-menu-opening', detail);
    }

    public onCellActionMenuOpenChange(event: CustomEvent): void {
        const cell = event.detail as TableCell;
        this.menuIsOpen = cell.menuIsOpen;
    }

    private hasValidFieldNames(keys: (string | undefined)[]): keys is string[] {
        return keys.every(key => key !== undefined);
    }
}

const nimbleTableRow = TableRow.compose({
    baseName: 'table-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableRow());
