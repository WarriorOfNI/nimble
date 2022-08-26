﻿namespace NimbleBlazor;

public enum DropdownAppearance
{
    Underline,
    Outline,
    Block
}

internal static class DropdownAppearanceExtensions
{
    private static readonly Dictionary<DropdownAppearance, string> _appearanceValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<DropdownAppearance>();

    public static string? ToAttributeValue(this DropdownAppearance? value) => value == null ? null : _appearanceValues[value.Value];
}