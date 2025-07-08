# TextMate Grammar Precompiler for Shiki

This script allows you to precompile any TextMate grammar file for use with Shiki's `createHighlighterCore` and the JavaScript regex engine.

## Usage

```bash
npx tsx precompile-grammar.ts <path-to-grammar-file>
```

### Example

```bash
npx tsx precompile-grammar.ts /path/to/your-language.tmLanguage.json
```

## What it does

1. **Reads** your TextMate grammar file (`.tmLanguage.json` format)
2. **Extracts** language information automatically:
   - Language name (from grammar `name` field or derived from scope/filename)
   - Display name (from grammar `name` field)
   - Scope name (from grammar `scopeName`)
   - File types (from grammar `fileTypes`)
   - Aliases (intelligently generated)
3. **Precompiles** regex patterns for the JavaScript engine using Shiki's precompiler
4. **Outputs** a `.mjs` file ready for import

## Output

The script generates:

- `{language-name}-precompiled.mjs` - Main precompiled grammar file
- `{language-name}-simple.mjs` - Fallback file (if precompilation fails)

## Language Information Extraction

The script intelligently extracts language information:

- **Name**: Uses grammar's `name` field (lowercased), or derives from `scopeName`, or uses filename
- **Display Name**: Uses grammar's `name` field as-is, or capitalizes the language name
- **Scope**: Uses grammar's `scopeName`, or generates `source.{language-name}`
- **File Types**: Uses grammar's `fileTypes` array, or defaults to `[language-name]`
- **Aliases**: Automatically generates reasonable aliases based on filename and grammar name

## Example Usage of Generated File

```javascript
import { createJavaScriptRawEngine } from '@shikijs/engine-javascript'
import { createHighlighterCore } from 'shiki'
import myLang from './my-language-precompiled.mjs'
import myTheme from './my-theme.mjs'

const highlighter = await createHighlighterCore({
  themes: [myTheme],
  langs: [myLang],
  engine: createJavaScriptRawEngine(),
})

const html = highlighter.codeToHtml('// your code here', {
  lang: 'my-language',
  theme: 'my-theme'
})
```

## Requirements

- Node.js with ES modules support
- The Shiki workspace (for accessing precompilation utilities)
- A valid TextMate grammar file in JSON format

## Error Handling

If precompilation fails (due to complex regex patterns), the script automatically creates a fallback version without regex precompilation that should still work with basic highlighting.
