import { Observable, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { Cell, Row } from '@tanstack/table-core';
import type { Table } from '../table';
import { TableCell } from '../table-cell';
import { styles } from './styles';
import { template } from './template';

export interface TableRowData {
    row: Row<unknown>;
    dataIndex: number;
    parent: Table;
    rowSize: number;
    rowPixelOffset?: number;
    visibleCells?: Cell<unknown, unknown>[];
}

/**
 *sdf
 */
export class TableRow extends FoundationElement {
    @observable
    public ready = false;

    public get rowData(): TableRowData {
        Observable.track(this, 'rowData');
        return this._rowData;
    }

    public set rowData(value: TableRowData) {
        this._rowData = value;
        this.visibleCells = this._rowData.row.getVisibleCells();
        this.style.transform = `translateY(${(this._rowData.rowPixelOffset ?? 0).toString()}px)`;
        Observable.notify(this, 'rowData');
        this.renderCells();
    }

    public parent: Table;
    public readonly rowContainer!: HTMLElement;

    private visibleCells: Cell<unknown, unknown>[] = [];
    private _rowData!: TableRowData;
    private readonly _cellViews: TableCell[] = [];

    public constructor(table: Table, rowData: TableRowData) {
        super();
        this.parent = table;
        this.rowData = rowData;
        this.ready = true;
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        if (this._cellViews.length === 0) {
            this.renderCells();
        } else {
            this.updateCellsData();
        }
    }

    private renderCells(): void {
        if (!this.isConnected) {
            return;
        }

        if (this._cellViews.length === 0) {
            this.visibleCells?.forEach((cell, i) => {
                const nimbleCellView = new TableCell();
                nimbleCellView.cellItemTemplate = this._rowData.parent.getColumnTemplate(i);
                nimbleCellView.cellData = cell.getValue();
                this.rowContainer.appendChild(nimbleCellView);

                this._cellViews.push(nimbleCellView);
            });
        } else {
            this.updateCellsData();
        }
    }

    private updateCellsData(): void {
        this.visibleCells?.forEach((cell, i) => {
            const cellView = this._cellViews[i];
            cellView!.cellData = cell.getValue();
        });
    }
}

const nimbleTableRow = TableRow.compose({
    baseName: 'table-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableRow());