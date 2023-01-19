import { attr, css, html } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { TableColumn } from '../base';
import type { TableStringField, TableCellState } from '../../table/types';
import { template } from '../base/template';
import '../../tooltip';

export type TableColumnImageCellRecord = TableStringField<'value'> & TableStringField<'quote'> & TableStringField<'id'>;
export interface TableColumnImageConfig {
    height: number;
    width: number;
}

/**
 * The table column for displaying images.
 */
export class TableColumnImage extends TableColumn<TableColumnImageCellRecord, TableColumnImageConfig> {
    public cellRecordFieldNames = ['value', 'quote', 'id'] as const;

    @attr({ attribute: 'image-field-name' })
    public imageFieldName?: string;

    @attr({ attribute: 'quote-field-name' })
    public quoteFieldName?: string;

    @attr({ attribute: 'first-name-field-name' })
    public firstNameFieldName?: string;

    @attr
    public height = 100;

    @attr
    public width = 75;

    public readonly cellStyles = css`
        img {
            filter: drop-shadow(30px 10px 4px #4444dd);;
        }
    `;

    public readonly cellTemplate = html<TableCellState<TableColumnImageCellRecord, TableColumnImageConfig>>`
    <div class="image-container" id="${x => x.cellRecord.id}">
        <img src="${x => x.cellRecord.value}" height="${x => x.columnConfig.height}" width="${x => x.columnConfig.width}">
        <nimble-tooltip class="image-tooltip" anchor="${x => x.cellRecord.id}">${x => x.cellRecord.quote}</nimble-tooltip>
    </div>
    `;

    public getColumnConfig(): TableColumnImageConfig {
        return { height: this.height, width: this.width };
    }

    public getDataRecordFieldNames(): (string | undefined)[] {
        return [this.imageFieldName, this.quoteFieldName, this.firstNameFieldName];
    }
}

const nimbleTableColumnImage = TableColumnImage.compose({
    baseName: 'table-column-image',
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnImage());
