import { attr, ElementStyles, nullableNumberConverter, ViewTemplate } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { ColumnConfig, TableCellState, TableRecord } from '../../table/types';

/**
 * The base class for table columns
 */
export abstract class TableColumn<
    TCellRecord extends TableRecord = TableRecord,
    TColumnConfig extends ColumnConfig = ColumnConfig
> extends FoundationElement {
    @attr({ attribute: 'fixed-size', converter: nullableNumberConverter })
    public fixedSize: number | null = null;

    @attr({ attribute: 'grid-size', converter: nullableNumberConverter })
    public gridSize = 1;

    @attr({ attribute: 'min-size' })
    public minSize?: number;

    @attr({ attribute: 'max-size' })
    public maxSize?: number;

    /**
     * The template to use to render the cell content for the column
     */
    // prettier-ignore
    public abstract cellTemplate: ViewTemplate<TableCellState<TCellRecord, TColumnConfig>>;

    /**
     * The style to apply to the cellTemplate
     */
    public abstract cellStyles?: ElementStyles;

    /**
     * The names of the fields that should be present in TCellRecord.
     * This array is parallel with the field names returned from `getRecordFieldNames()`.
     */
    public abstract readonly cellStateDataFieldNames: readonly string[];

    /**
     * This method returns the relevant, static configuration a column requires its cellTemplate
     * to have access to.
     */
    public abstract getColumnConfig(): TColumnConfig;

    /**
     * The names of the fields from the row's record that correlate to the data that will be in TCellRecord.
     * This array is parallel with the field names specified by `cellStateDataFieldNames`.
     */
    public abstract getRecordFieldNames(): (string | undefined)[];
}
