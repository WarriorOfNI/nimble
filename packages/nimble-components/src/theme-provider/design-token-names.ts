/**
 * Design token names should follow the token naming convention:
 * See: https://github.com/ni/nimble/blob/main/packages/nimble-components/CONTRIBUTING.md#token-naming
 */

import type * as TokensNamespace from './design-tokens';

type TokenName = keyof typeof TokensNamespace;

export const tokenNames: { readonly [key in TokenName]: string } = {
    actionRgbPartialColor: 'action-rgb-partial-color',
    applicationBackgroundColor: 'application-background-color',
    dividerBackgroundColor: 'divider-background-color',
    headerBackgroundColor: 'header-background-color',
    sectionBackgroundColor: 'section-background-color',
    fillSelectedColor: 'fill-selected-color',
    fillSelectedRgbPartialColor: 'fill-selected-rgb-partial-color',
    fillHoverSelectedColor: 'fill-hover-selected-color',
    fillHoverColor: 'fill-hover-color',
    fillDownColor: 'fill-down-color',
    borderColor: 'border-color',
    borderRgbPartialColor: 'border-rgb-partial-color',
    failColor: 'fail-color',
    warningColor: 'warning-color',
    passColor: 'pass-color',
    informationColor: 'information-color',
    borderHoverColor: 'border-hover-color',
    ozoneLibraryBackgroundColor: 'ozone-library-background-color',
    iconColor: 'icon-color',
    modalBackdropColor: 'modal-backdrop-color',
    popupBorderColor: 'popup-border-color',
    controlHeight: 'control-height',
    smallPadding: 'small-padding',
    standardPadding: 'standard-padding',
    labelHeight: 'label-height',
    borderWidth: 'border-width',
    iconSize: 'icon-size',
    groupHeaderTextTransform: 'group-header-text-transform',
    drawerWidth: 'drawer-width',
    spinnerSmallHeight: 'spinner-small-height',
    spinnerMediumHeight: 'spinner-medium-height',
    spinnerLargeHeight: 'spinner-large-height',
    smallDelay: 'small-delay',
    mediumDelay: 'medium-delay',
    largeDelay: 'large-delay',
    headlinePlus1Font: 'headline-plus-1-font',
    headlinePlus1FontColor: 'headline-plus-1-font-color',
    headlinePlus1DisabledFontColor: 'headline-plus-1-disabled-font-color',
    headlinePlus1FontFamily: 'headline-plus-1-font-family',
    headlinePlus1FontSize: 'headline-plus-1-font-size',
    headlinePlus1FontWeight: 'headline-plus-1-font-weight',
    headlinePlus1FontLineHeight: 'headline-plus-1-font-line-height',
    headlinePlus1FallbackFontFamily: 'headline-plus-1-fallback-font-family',
    headlineFont: 'headline-font',
    headlineFontColor: 'headline-font-color',
    headlineDisabledFontColor: 'headline-disabled-font-color',
    headlineFontFamily: 'headline-font-family',
    headlineFontSize: 'headline-font-size',
    headlineFontWeight: 'headline-font-weight',
    headlineFontLineHeight: 'headline-font-line-height',
    headlineFallbackFontFamily: 'headline-fallback-font-family',
    tableHeaderFont: 'table-header-font',
    tableHeaderFontColor: 'table-header-font-color',
    tableHeaderDisabledFontColor: 'table-header-disabled-font-color',
    tableHeaderFontFamily: 'table-header-font-family',
    tableHeaderFontSize: 'table-header-font-size',
    tableHeaderFontWeight: 'table-header-font-weight',
    tableHeaderFontLineHeight: 'table-header-font-line-height',
    tableHeaderFallbackFontFamily: 'table-header-fallback-font-family',
    titlePlus2Font: 'title-plus-2-font',
    titlePlus2FontColor: 'title-plus-2-font-color',
    titlePlus2DisabledFontColor: 'title-plus-2-disabled-font-color',
    titlePlus2FontFamily: 'title-plus-2-font-family',
    titlePlus2FontSize: 'title-plus-2-font-size',
    titlePlus2FontWeight: 'title-plus-2-font-weight',
    titlePlus2FontLineHeight: 'title-plus-2-font-line-height',
    titlePlus2FallbackFontFamily: 'title-plus-2-fallback-font-family',
    titlePlus1Font: 'title-plus-1-font',
    titlePlus1FontColor: 'title-plus-1-font-color',
    titlePlus1DisabledFontColor: 'title-plus-1-disabled-font-color',
    titlePlus1FontFamily: 'title-plus-1-font-family',
    titlePlus1FontSize: 'title-plus-1-font-size',
    titlePlus1FontWeight: 'title-plus-1-font-weight',
    titlePlus1FontLineHeight: 'title-plus-1-font-line-height',
    titlePlus1FallbackFontFamily: 'title-plus-1-fallback-font-family',
    titleFont: 'title-font',
    titleFontColor: 'title-font-color',
    titleDisabledFontColor: 'title-disabled-font-color',
    titleFontFamily: 'title-font-family',
    titleFontSize: 'title-font-size',
    titleFontWeight: 'title-font-weight',
    titleFontLineHeight: 'title-font-line-height',
    titleFallbackFontFamily: 'title-fallback-font-family',
    subtitlePlus1Font: 'subtitle-plus-1-font',
    subtitlePlus1FontColor: 'subtitle-plus-1-font-color',
    subtitlePlus1DisabledFontColor: 'subtitle-plus-1-disabled-font-color',
    subtitlePlus1FontFamily: 'subtitle-plus-1-font-family',
    subtitlePlus1FontSize: 'subtitle-plus-1-font-size',
    subtitlePlus1FontWeight: 'subtitle-plus-1-font-weight',
    subtitlePlus1FontLineHeight: 'subtitle-plus-1-font-line-height',
    subtitlePlus1FallbackFontFamily: 'subtitle-plus-1-fallback-font-family',
    subtitleFont: 'subtitle-font',
    subtitleFontColor: 'subtitle-font-color',
    subtitleDisabledFontColor: 'subtitle-disabled-font-color',
    subtitleFontFamily: 'subtitle-font-family',
    subtitleFontSize: 'subtitle-font-size',
    subtitleFontWeight: 'subtitle-font-weight',
    subtitleFontLineHeight: 'subtitle-font-line-height',
    subtitleFallbackFontFamily: 'subtitle-fallback-font-family',
    linkFont: 'link-font',
    linkFontColor: 'link-font-color',
    linkDisabledFontColor: 'link-disabled-font-color',
    linkFontFamily: 'link-font-family',
    linkFontSize: 'link-font-size',
    linkFontWeight: 'link-font-weight',
    linkFontLineHeight: 'link-font-line-height',
    linkFallbackFontFamily: 'link-fallback-font-family',
    linkActiveFont: 'link-active-font',
    linkActiveFontColor: 'link-active-font-color',
    linkActiveDisabledFontColor: 'link-active-disabled-font-color',
    linkActiveFontFamily: 'link-active-font-family',
    linkActiveFontSize: 'link-active-font-size',
    linkActiveFontWeight: 'link-active-font-weight',
    linkActiveFontLineHeight: 'link-active-font-line-height',
    linkActiveFallbackFontFamily: 'link-active-fallback-font-family',
    linkProminentFont: 'link-prominent-font',
    linkProminentFontColor: 'link-prominent-font-color',
    linkProminentDisabledFontColor: 'link-prominent-disabled-font-color',
    linkProminentFontFamily: 'link-prominent-font-family',
    linkProminentFontSize: 'link-prominent-font-size',
    linkProminentFontWeight: 'link-prominent-font-weight',
    linkProminentFontLineHeight: 'link-prominent-font-line-height',
    linkProminentFallbackFontFamily: 'link-prominent-fallback-font-family',
    linkActiveProminentFont: 'link-active-prominent-font',
    linkActiveProminentFontColor: 'link-active-prominent-font-color',
    linkActiveProminentDisabledFontColor:
        'link-active-prominent-disabled-font-color',
    linkActiveProminentFontFamily: 'link-active-prominent-font-family',
    linkActiveProminentFontSize: 'link-active-prominent-font-size',
    linkActiveProminentFontWeight: 'link-active-prominent-font-weight',
    linkActiveProminentFontLineHeight: 'link-active-prominent-font-line-height',
    linkActiveProminentFallbackFontFamily:
        'link-active-prominent-fallback-font-family',
    placeholderFont: 'placeholder-font',
    placeholderFontColor: 'placeholder-font-color',
    placeholderDisabledFontColor: 'placeholder-disabled-font-color',
    placeholderFontFamily: 'placeholder-font-family',
    placeholderFontSize: 'placeholder-font-size',
    placeholderFontWeight: 'placeholder-font-weight',
    placeholderFontLineHeight: 'placeholder-font-line-height',
    placeholderFallbackFontFamily: 'placeholder-fallback-font-family',
    bodyEmphasizedFont: 'body-emphasized-font',
    bodyEmphasizedFontColor: 'body-emphasized-font-color',
    bodyEmphasizedDisabledFontColor: 'body-emphasized-disabled-font-color',
    bodyEmphasizedFontFamily: 'body-emphasized-font-family',
    bodyEmphasizedFontSize: 'body-emphasized-font-size',
    bodyEmphasizedFontWeight: 'body-emphasized-font-weight',
    bodyEmphasizedFontLineHeight: 'body-emphasized-font-line-height',
    bodyEmphasizedFallbackFontFamily: 'body-emphasized-fallback-font-family',
    bodyFont: 'body-font',
    bodyFontColor: 'body-font-color',
    bodyDisabledFontColor: 'body-disabled-font-color',
    bodyFontFamily: 'body-font-family',
    bodyFontSize: 'body-font-size',
    bodyFontWeight: 'body-font-weight',
    bodyFontLineHeight: 'body-font-line-height',
    bodyFallbackFontFamily: 'body-fallback-font-family',
    groupHeaderFont: 'group-header-font',
    groupHeaderFontColor: 'group-header-font-color',
    groupHeaderDisabledFontColor: 'group-header-disabled-font-color',
    groupHeaderFontFamily: 'group-header-font-family',
    groupHeaderFontSize: 'group-header-font-size',
    groupHeaderFontWeight: 'group-header-font-weight',
    groupHeaderFontLineHeight: 'group-header-font-line-height',
    groupHeaderFallbackFontFamily: 'group-header-fallback-font-family',
    controlLabelFont: 'control-label-font',
    controlLabelFontColor: 'control-label-font-color',
    controlLabelDisabledFontColor: 'control-label-disabled-font-color',
    controlLabelFontFamily: 'control-label-font-family',
    controlLabelFontSize: 'control-label-font-size',
    controlLabelFontWeight: 'control-label-font-weight',
    controlLabelFontLineHeight: 'control-label-font-line-height',
    controlLabelFallbackFontFamily: 'control-label-fallback-font-family',
    buttonLabelFont: 'button-label-font',
    buttonLabelFontColor: 'button-label-font-color',
    buttonLabelDisabledFontColor: 'button-label-disabled-font-color',
    buttonLabelFontFamily: 'button-label-font-family',
    buttonLabelFontSize: 'button-label-font-size',
    buttonLabelFontWeight: 'button-label-font-weight',
    buttonLabelFontLineHeight: 'button-label-font-line-height',
    buttonLabelFallbackFontFamily: 'button-label-fallback-font-family',
    tooltipCaptionFont: 'tooltip-caption-font',
    tooltipCaptionFontColor: 'tooltip-caption-font-color',
    tooltipCaptionDisabledFontColor: 'tooltip-caption-disabled-font-color',
    tooltipCaptionFontFamily: 'tooltip-caption-font-family',
    tooltipCaptionFontSize: 'tooltip-caption-font-size',
    tooltipCaptionFontWeight: 'tooltip-caption-font-weight',
    tooltipCaptionFontLineHeight: 'tooltip-caption-font-line-height',
    tooltipCaptionFallbackFontFamily: 'tooltip-caption-fallback-font-family',
    tooltipBackgroundColor: 'tooltip-background-color',
    errorTextFont: 'error-text-font',
    errorTextFontColor: 'error-text-font-color',
    errorTextDisabledFontColor: 'error-text-disabled-font-color',
    errorTextFontFamily: 'error-text-font-family',
    errorTextFontSize: 'error-text-font-size',
    errorTextFontWeight: 'error-text-font-weight',
    errorTextFontLineHeight: 'error-text-font-line-height',
    errorTextFallbackFontFamily: 'error-text-fallback-font-family',
    tableRowBorderColor: 'table-row-border-color',
    elevation1BoxShadow: 'elevation-1-box-shadow',
    elevation2BoxShadow: 'elevation-2-box-shadow',
    elevation3BoxShadow: 'elevation-3-box-shadow'
};

const prefix = 'ni-nimble';

export const styleNameFromTokenName = (tokenName: string): string => `${prefix}-${tokenName}`;
export const cssPropertyFromTokenName = (tokenName: string): string => `--${prefix}-${tokenName}`;
export const scssPropertyFromTokenName = (tokenName: string): string => `$${prefix}-${tokenName}`;
export const scssPropertySetterMarkdown = (
    tokenName: string,
    cssProperty: string
): string => `\`${cssProperty}: $${prefix}-${tokenName};\``;
export const scssInternalPropertyFromTokenName = (tokenName: string): string => `$${prefix}-internal-${tokenName}`;
export const scssInternalPropertySetterMarkdown = (
    tokenName: string,
    property: string
): string => `\`#{$${prefix}-internal-${tokenName}}: ${property};\``;

// Order of suffixes in the array matter, as we want single word suffixes after the multi-word ones
const tokenSuffixes = [
    'RgbPartialColor',
    'FontColor',
    'FontLineHeight',
    'FontWeight',
    'FontSize',
    'TextTransform',
    'FontFamily',
    'BoxShadow',
    'Font',
    'Size',
    'Width',
    'Height',
    'Delay',
    'Padding',
    'Color'
] as const;
export type TokenSuffix = (typeof tokenSuffixes)[number];
export const suffixFromTokenName = (
    tokenName: string
): TokenSuffix | undefined => tokenSuffixes[
    tokenSuffixes.findIndex(tokenSuffix => tokenName.endsWith(tokenSuffix))
];
