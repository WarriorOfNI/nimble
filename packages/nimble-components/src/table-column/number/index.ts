import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableFieldValue, TableNumberField } from '../../table/types';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { TableColumnTextFormatBase } from '../text-format-base';

export type TableColumnNumberCellRecord = TableNumberField<'value'>;
export interface TableColumnNumberColumnConfig {
    placeholder: string;
    formatFunction: (data: number) => string;
}

/**
 * The table column for displaying numbers.
 */
export class TableColumnNumber extends TableColumnTextFormatBase {
    public override textAlignEnd = true;

    public override shouldUsePlaceholder(data: TableFieldValue): boolean {
        return typeof data !== 'number';
    }

    public override formatFunction(data: number): string {
        return data.toString();
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
