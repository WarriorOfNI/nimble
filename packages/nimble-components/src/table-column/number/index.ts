import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableNumberField, TableFieldName } from '../../table/types';
import { TableColumn } from '../base';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { cellStyles } from './styles';
import { cellTemplate } from './template';

export type TableColumnNumberCellRecord = TableNumberField<'value'>;
export interface TableColumnNumberColumnConfig {
    placeholder: string;
    formatFunction: (data: number) => string;
}

/**
 * The table column for displaying numbers.
 */
export class TableColumnNumber extends TableColumn<
TableColumnNumberCellRecord,
TableColumnNumberColumnConfig
> {
    public cellRecordFieldNames = ['value'] as const;

    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    @attr
    public placeholder?: string;

    @attr
    public formatFunction?: (data: number) => string;

    public readonly cellStyles = cellStyles;

    public readonly cellTemplate = cellTemplate;

    private static defaultFormatFunction(x: number): string {
        return x.toString();
    }

    public getColumnConfig(): TableColumnNumberColumnConfig {
        return {
            placeholder: this.placeholder ?? '',
            formatFunction: this.formatFunction ?? TableColumnNumber.defaultFormatFunction
        };
    }

    public getDataRecordFieldNames(): (TableFieldName | undefined)[] {
        return [this.fieldName];
    }
}

const nimbleTableColumnNumber = TableColumnNumber.compose({
    baseName: 'table-column-number',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnNumber());
