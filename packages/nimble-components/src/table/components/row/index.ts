import { Notifier, Observable, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { TableCellState, TableRecord } from '../../types';
import type { TableColumn } from '../../../table-column/base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-row': TableRow;
    }
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
    public columns?: TableColumn[];

    /**
     * @internal
     */
    @observable
    public rowGridColumns?: string;

    private readonly _columnObservers: Notifier[] = [];

    public getCellState(column: TableColumn): TableCellState {
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
            const cellState: TableCellState = {
                data: cellData,
                columnConfig
            };
            return cellState;
        }

        return { data: {}, columnConfig: {} };
    }

    public getTemplateColumns(): string {
        return this.columns?.reduce((accumulator: string, currentValue) => {
            const gap = accumulator === '' ? '' : ' ';
            if (currentValue.currentFixedWidth) {
                return `${accumulator}${gap}${currentValue.currentFixedWidth}px`;
            }

            return `${accumulator}${gap}${currentValue.currentFractionalWidth}fr`;
        }, '') ?? '';
    }

    protected columnsChanged(): void {
        this._columnObservers.forEach(observer => observer.unsubscribe({ handleChange: this.handleChange }));
        for (const column of this.columns ?? []) {
            const observer = Observable.getNotifier(column);
            observer.subscribe({ handleChange: this.handleChange });
            this._columnObservers.push(observer);
        }
        this.rowGridColumns = this.getTemplateColumns();
    }

    private readonly handleChange = (_: TableColumn, __: string): void => {
        this.rowGridColumns = this.getTemplateColumns();
    };

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
