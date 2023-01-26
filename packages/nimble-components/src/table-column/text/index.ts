import { attr } from '@microsoft/fast-element';
import { applyMixins, DesignSystem } from '@microsoft/fast-foundation';
import type { ColumnConfig, StringField } from '../../table/types';
import { TableColumn } from '../base';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { FractionalWidthColumn } from '../extensions/fractional-width-column';
import { cellStyles } from './styles';
import { cellTemplate } from './template';

export type TableColumnTextCellRecord = StringField<'value'>;
export interface TableColumnTextColumnConfig extends ColumnConfig {
    placeholder: string;
}

/**
 * The table column for displaying strings.
 */
export class TableColumnText extends TableColumn<
TableColumnTextCellRecord,
TableColumnTextColumnConfig
> {
    public cellStateDataFieldNames = ['value'] as const;

    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr
    public placeholder?: string;

    public readonly cellStyles = cellStyles;

    public readonly cellTemplate = cellTemplate;

    public getColumnConfig(): TableColumnTextColumnConfig {
        return { placeholder: this.placeholder ?? '' };
    }

    public getRecordFieldNames(): (string | undefined)[] {
        return [this.fieldName];
    }
}

applyMixins(TableColumnText, FractionalWidthColumn);
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TableColumnText extends FractionalWidthColumn {}

const nimbleTableColumnText = TableColumnText.compose({
    baseName: 'table-column-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnText());
