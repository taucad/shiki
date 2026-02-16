const lang = Object.freeze({
  name: 'kcl',
  scopeName: 'source.kcl',
  displayName: 'KCL',
  fileTypes: ['kcl'],
  aliases: undefined,
  patterns: [
    { name: 'comment.line.shebang.kcl', match: /^#![^\n]*/dgu },
    { name: 'comment.line.documentation.module.kcl', match: /\/\/![^\n]*/dgu },
    { name: 'comment.line.documentation.kcl', match: /\/\/\/[^\n]*/dgu },
    { name: 'comment.line.double-slash.kcl', match: /\/\/[^\n]*/dgu },
    { name: 'keyword.control.conditional.kcl', match: /\b(if|else)\b/dgu },
    { name: 'keyword.control.return.kcl', match: /\breturn\b/dgu },
    { name: 'keyword.control.function.kcl', match: /\bfn\b/dgu },
    { name: 'storage.modifier.export.kcl', match: /\bexport\b/dgu },
    {
      name: 'meta.annotation.kcl',
      begin: /@\(/dgu,
      beginCaptures: { 0: { name: 'punctuation.definition.annotation.begin.kcl' } },
      end: /\)/dgu,
      endCaptures: { 0: { name: 'punctuation.definition.annotation.end.kcl' } },
      patterns: [{ include: '#annotation-kv' }, { name: 'punctuation.separator.comma.kcl', match: /,/dgu }],
    },
    {
      name: 'meta.import.kcl',
      begin: /\b(import)\p{space}+/dgu,
      beginCaptures: { 1: { name: 'keyword.control.import.kcl' } },
      end: /(?=\n|;)|(?<=\))/dgu,
      patterns: [
        {
          name: 'string.quoted.double.kcl',
          begin: /"/dgu,
          end: /"/dgu,
          beginCaptures: { 0: { name: 'punctuation.definition.string.begin.kcl' } },
          endCaptures: { 0: { name: 'punctuation.definition.string.end.kcl' } },
          patterns: [{ include: '#escape-sequence' }],
        },
        { name: 'keyword.control.import.as.kcl', match: /\bas\b/dgu },
        { name: 'entity.name.import.alias.kcl', match: /(?<=as\p{space})[\p{L}\p{M}\p{N}\p{Pc}]+/dgu },
      ],
    },
    { name: 'entity.name.tag.kcl', match: /\$[\p{L}\p{M}\p{N}\p{Pc}]+\b/dgu },
    {
      name: 'meta.function.declaration.kcl',
      begin: /\b(fn)\p{space}+([\p{L}\p{M}\p{N}\p{Pc}]+)\p{space}*(\()/dgu,
      beginCaptures: {
        1: { name: 'keyword.control.function.kcl' },
        2: { name: 'entity.name.function.kcl' },
        3: { name: 'punctuation.section.parameters.begin.kcl' },
      },
      end: /\)/dgu,
      endCaptures: { 0: { name: 'punctuation.section.parameters.end.kcl' } },
      patterns: [
        { include: '#parameter' },
        { name: 'punctuation.separator.parameter.kcl', match: /,/dgu },
        { include: '#comment' },
      ],
    },
    {
      name: 'meta.return-type.kcl',
      begin: /(?<=\))\p{space}*(\?)?(:)/dgu,
      beginCaptures: {
        1: { name: 'keyword.operator.optional-return.kcl' },
        2: { name: 'punctuation.separator.type.kcl' },
      },
      end: /(?=\{)/dgu,
      patterns: [{ include: '#type-name' }],
    },
    {
      name: 'meta.function.invocation.kcl',
      match: /\b([\p{L}\p{M}\p{N}\p{Pc}]+)\p{space}*(?=\()/dgu,
      captures: { 1: { name: 'entity.name.function.call.kcl' } },
    },
    { include: '#anonymous-function' },
    {
      name: 'string.quoted.double.kcl',
      begin: /"/dgu,
      end: /"/dgu,
      beginCaptures: { 0: { name: 'punctuation.definition.string.begin.kcl' } },
      endCaptures: { 0: { name: 'punctuation.definition.string.end.kcl' } },
      patterns: [{ include: '#escape-sequence' }],
    },
    { name: 'keyword.operator.control.pipeline.kcl', match: /\|>/dgu },
    { name: 'variable.language.pipe-substitution.kcl', match: /%/dgu },
    { match: /\b(true|false)\b/dgu, name: 'constant.language.boolean.kcl' },
    {
      name: 'constant.numeric.kcl',
      match: /-?\b\p{Nd}+(\.\p{Nd}+)?([eE][+\-]?\p{Nd}+)?\b|-?\.\p{Nd}+([eE][+\-]?\p{Nd}+)?\b/dgu,
    },
    { name: 'keyword.operator.comparison.kcl', match: /(==|!=|<=|>=|<|>)/dgu },
    { name: 'keyword.operator.logical.kcl', match: /(&|\|)(?!>)/dgu },
    { name: 'keyword.operator.arithmetic.kcl', match: /[+\-*/^]/dgu },
    { name: 'keyword.operator.assignment.kcl', match: /=/dgu },
    { name: 'support.constant.prelude.kcl', match: /\b(ZERO|QUARTER_TURN|HALF_TURN|THREE_QUARTER_TURN)\b/dgu },
    {
      name: 'support.function.stdlib.kcl',
      match:
        /\b(abs|acos|appearance|arc|angledLine|angledLineOfXLength|angledLineOfYLength|angledLineThatIntersects|angledLineToX|angledLineToY|angleToMatchLengthX|angleToMatchLengthY|asin|assert|assertEqual|assertGreaterThan|assertGreaterThanOrEq|assertLessThan|assertLessThanOrEq|atan|bezierCurve|ceil|chamfer|circle|clone|close|cm|cos|e|extrude|fillet|floor|ft|getNextAdjacentEdge|getOppositeEdge|getPreviousAdjacentEdge|helix|hole|hollow|import|inch|int|lastSegX|lastSegY|legAngX|legAngY|legLen|line|lineTo|ln|loft|log|log10|log2|m|map|max|min|mirror2d|mm|offsetPlane|patternCircular2d|patternCircular3d|patternLinear2d|patternLinear3d|patternTransform|pi|polar|polygon|pow|profileStart|profileStartX|profileStartY|push|reduce|rem|revolve|rotate|segAng|segEnd|segEndX|segEndY|segLen|segStart|segStartX|segStartY|shell|sin|sqrt|startProfile|startProfileAt|startSketchAt|startSketchOn|tan|tangentialArc|tangentialArcTo|tangentialArcToRelative|tau|toDegrees|toRadians|translate|xLine|xLineTo|yd|yLine|yLineTo)\b/dgu,
    },
    { name: 'punctuation.section.array.begin.kcl', match: /\[/dgu },
    { name: 'punctuation.section.array.end.kcl', match: /\]/dgu },
    { name: 'punctuation.section.block.begin.kcl', match: /\{/dgu },
    { name: 'punctuation.section.block.end.kcl', match: /\}/dgu },
    { name: 'punctuation.separator.colon.kcl', match: /:/dgu },
    { name: 'punctuation.separator.comma.kcl', match: /,/dgu },
    {
      name: 'variable.parameter.named.kcl',
      match: /(?<=\(|,)\p{space}*([\p{L}\p{M}\p{N}\p{Pc}]+)\p{space}*(?==)/dgu,
      captures: { 1: { name: 'variable.parameter.kcl' } },
    },
    { name: 'variable.other.kcl', match: /\b([\p{L}\p{M}\p{N}\p{Pc}]+)\b/dgu },
  ],
  repository: {
    'comment': {
      patterns: [
        { name: 'comment.line.documentation.module.kcl', match: /\/\/![^\n]*/dgu },
        { name: 'comment.line.documentation.kcl', match: /\/\/\/[^\n]*/dgu },
        { name: 'comment.line.double-slash.kcl', match: /\/\/[^\n]*/dgu },
      ],
    },
    'escape-sequence': { name: 'constant.character.escape.kcl', match: /\\(["\\/bfnrt]|u[0-9a-fA-F]{4})/dgu },
    'parameter': {
      patterns: [
        {
          name: 'meta.parameter.kcl',
          match: /(@)?([\p{L}\p{M}\p{N}\p{Pc}]+)(\?)?(?:\p{space}*(:)\p{space}*([\p{L}\p{M}\p{N}\p{Pc}]+))?/dgu,
          captures: {
            1: { name: 'storage.modifier.parameter-attribute.kcl' },
            2: { name: 'variable.parameter.kcl' },
            3: { name: 'keyword.operator.optional.kcl' },
            4: { name: 'punctuation.separator.type.kcl' },
            5: { name: 'support.type.kcl' },
          },
        },
      ],
    },
    'type-name': {
      patterns: [
        {
          name: 'meta.type.union.kcl',
          match: /([\p{L}\p{M}\p{N}\p{Pc}]+)(?:\p{space}*(\()\p{space}*([\p{L}\p{M}\p{N}\p{Pc}]+)\p{space}*(\)))?/dgu,
          captures: {
            1: { name: 'support.type.kcl' },
            2: { name: 'punctuation.section.type-units.begin.kcl' },
            3: { name: 'support.type.unit.kcl' },
            4: { name: 'punctuation.section.type-units.end.kcl' },
          },
        },
        { name: 'keyword.operator.type-union.kcl', match: /\|(?!>)/dgu },
      ],
    },
    'annotation-kv': {
      name: 'meta.annotation.key-value.kcl',
      match: /([\p{L}\p{M}\p{N}\p{Pc}]+)\p{space}*(=)\p{space}*([\p{L}\p{M}\p{N}\p{Pc}]+)/dgu,
      captures: {
        1: { name: 'entity.other.attribute-name.kcl' },
        2: { name: 'keyword.operator.assignment.kcl' },
        3: { name: 'string.unquoted.attribute-value.kcl' },
      },
    },
    'anonymous-function': {
      name: 'meta.function.anonymous.kcl',
      begin:
        /(\()(?=\p{space}*[\p{L}\p{M}\p{N}\p{Pc}]+(?:\p{space}*,\p{space}*[\p{L}\p{M}\p{N}\p{Pc}]+)*\)\p{space}*=>)/dgu,
      beginCaptures: { 1: { name: 'punctuation.section.parameters.begin.kcl' } },
      end: /(=>)\p{space}*(\{)/dgu,
      endCaptures: {
        1: { name: 'keyword.operator.fat-arrow.kcl' },
        2: { name: 'punctuation.section.block.begin.kcl' },
      },
      patterns: [
        { name: 'variable.parameter.kcl', match: /\b[\p{L}\p{M}\p{N}\p{Pc}]+\b/dgu },
        { name: 'punctuation.separator.parameter.function.kcl', match: /,/dgu },
        { name: 'punctuation.section.parameters.end.kcl', match: /\)/dgu },
      ],
    },
  },
  embeddedLangs: [],
})

const langs = [lang]

export default langs
