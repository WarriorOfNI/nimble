/**
 * nimble-extensions.js is used as a custom configuration file in the Adobe XD
 * extension settings. It both augments the ./config generated by the extension
 * and performs additional StyleDictionary builds for custom platforms.
 */

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const hexRgb = require('hex-rgb');
const StyleDictionary = require('style-dictionary');
const config = require('./config');

// Workaround to include TypeScript definitions in output.
// See: https://github.com/AdobeXD/design-system-package-dsp/issues/22

config.platforms.js.files.push({
    destination: 'tokens.d.ts',
    format: 'typescript/es6-declarations'
});

module.exports = config;

StyleDictionary.registerTransform({
    type: 'value',
    transitive: true,
    name: 'font/weight',
    matcher: token => token.attributes.category === 'font',
    transformer: token => {
        if (token.value === 'Light') {
            token.value = '300';
        } else if (token.value === 'Regular') {
            token.value = '400';
        } else if (token.value === 'Semibold') {
            token.value = '600';
        } else if (token.value === 'Bold') {
            token.value = '700';
        }
        return token.value;
    }
});

// Workaround as name/dsp/kebab does not support prefixes
// See: https://github.com/AdobeXD/design-system-package-dsp/issues/27
const { type, matcher, transformer } = StyleDictionary.transform['name/dsp/kebab'];
StyleDictionary.registerTransform({
    name: 'name/nimble/kebab',
    type,
    matcher,
    transformer: function (prop) {
        return `ni-nimble-base-${transformer(prop)}`;
    }
});

// Combination of DSP & Nimble transform overrides
StyleDictionary.registerTransformGroup({
    name: 'css',
    transforms: [
        'attribute/cti',
        'name/nimble/kebab', // replaces name/dsp/kebab from DSP config
        'time/seconds',
        'content/icon',
        'size/px', // replaces size/rem from DSP config
        'color/css',
        'font/weight'
    ]
});

// Combination of DSP & Nimble transform overrides
StyleDictionary.registerTransformGroup({
    name: 'scss',
    transforms: [
        'attribute/cti',
        'name/nimble/kebab', // replaces name/dsp/kebab from DSP config
        'time/seconds',
        'content/icon',
        'size/px', // replaces size/rem from DSP config
        'color/css',
        'font/weight'
    ]
});

// Combination of DSP & Nimble transform overrides
StyleDictionary.registerTransformGroup({
    name: 'js',
    transforms: [
        'attribute/cti',
        'name/dsp/pascal', // replaces 'name/cti/pascal',
        'size/px', // replaces size/rem from DSP config
        'color/hex',
        'font/weight'
    ]
});

// Templates and transforms to build XAML compatible token resource dictionaries
const xamlColorTemplatePath = path.resolve(__dirname, './templates/XamlColor.template');
console.log(`XamlColor template path: ${xamlColorTemplatePath}`);
const xamlColorTemplate = _.template(fs.readFileSync(xamlColorTemplatePath));

StyleDictionary.registerFormat({
    name: 'xaml/XamlColor',
    formatter: xamlColorTemplate
});

StyleDictionary.registerTransformGroup({
    name: 'ni-xaml-color',
    transforms: [
        'attribute/cti',
        'size/px',
        'color/hex8android'
    ]
});

const xamlStyleDictionary = StyleDictionary.extend(
    {
        source: [
            'properties/colors.json'
        ],
        platforms: {
            xaml: {
                files: [
                    {
                        destination: 'colors.xaml',
                        format: 'xaml/XamlColor'
                    }
                ],
                transformGroup: 'ni-xaml-color',
                buildPath: 'xaml/'
            }
        }
    }
);

// Templates and transforms to build C# token class
const cSharpClassColorTemplatePath = path.resolve(__dirname, './templates/cSharpClassColor.template');
console.log(`cSharpClassColor template path: ${cSharpClassColorTemplatePath}`);
const cSharpClassColorTemplate = _.template(fs.readFileSync(cSharpClassColorTemplatePath));

StyleDictionary.registerFormat({
    name: 'cSharpClass/Color',
    formatter: cSharpClassColorTemplate
});

StyleDictionary.registerTransform({
    name: 'color/FromRgb',
    type: 'value',
    transitive: true,
    matcher: token => token.attributes.category === 'color',
    transformer: token => {
        const color = hexRgb(token.value);
        return `${color.red}, ${color.green}, ${color.blue}`;
    }
});

StyleDictionary.registerTransformGroup({
    name: 'ni-color-class',
    transforms: [
        'attribute/cti',
        'name/ti/camel',
        'color/FromRgb'
    ]
});

const cSharpClassStyleDictionary = StyleDictionary.extend(
    {
        source: [
            'properties/colors.json',
        ],
        platforms: {
            xaml: {
                files: [
                    {
                        destination: 'colors.cs',
                        format: 'cSharpClass/Color'
                    }
                ],
                transformGroup: 'ni-color-class',
                buildPath: 'csharp/'
            }
        }
    }
);

xamlStyleDictionary.buildAllPlatforms();
cSharpClassStyleDictionary.buildAllPlatforms();
