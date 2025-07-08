import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { toJsLiteral } from './packages/langs-precompiled/scripts/langs.js'
import { precompileGrammar } from './packages/langs-precompiled/scripts/precompile.js'

// Get grammar file path from command line arguments
const grammarFilePath = process.argv[2]

if (!grammarFilePath) {
  console.error('❌ Please provide a TextMate grammar file path as an argument')
  console.error('Usage: npx tsx precompile-grammar.ts <path-to-grammar.tmLanguage.json>')
  process.exit(1)
}

if (!fs.existsSync(grammarFilePath)) {
  console.error(`❌ Grammar file not found: ${grammarFilePath}`)
  process.exit(1)
}

// Read the TextMate grammar file
const grammar = JSON.parse(fs.readFileSync(grammarFilePath, 'utf8'))

// Extract language information from the grammar file
function extractLanguageInfo(grammar: any, filePath: string): {
  name: string
  scopeName: string
  displayName: string
  fileTypes: string[]
  aliases?: string[]
} {
  // Get the base filename without extension as fallback language name
  const baseName = path.basename(filePath, path.extname(filePath))
    .replace(/\.tmLanguage$/, '') // Remove .tmLanguage if present
    .toLowerCase()

  // Extract scope name and derive language name from it
  const scopeName = grammar.scopeName || `source.${baseName}`
  const scopeParts = scopeName.split('.')
  const langFromScope = scopeParts[scopeParts.length - 1] || baseName

  // Use explicit name from grammar, or derive from scope, or use filename
  const languageName = grammar.name?.toLowerCase() || langFromScope || baseName

  // Create display name - use grammar name or create from language name
  const displayName = grammar.name
    || languageName.charAt(0).toUpperCase() + languageName.slice(1)

  // Extract file types from grammar
  const fileTypes = grammar.fileTypes || [languageName]

  // Generate reasonable aliases
  const aliases = []
  if (languageName !== baseName) {
    aliases.push(baseName)
  }
  if (grammar.name && grammar.name.toLowerCase() !== languageName) {
    aliases.push(grammar.name.toLowerCase())
  }

  return {
    name: languageName,
    scopeName,
    displayName,
    fileTypes,
    aliases: aliases.length > 0 ? aliases : undefined,
  }
}

const languageInfo = extractLanguageInfo(grammar, grammarFilePath)

// Create a proper LanguageRegistration object
const languageRegistration = {
  ...languageInfo,
  patterns: grammar.patterns,
  repository: grammar.repository,
  embeddedLangs: [], // Most languages don't embed others by default
}

try {
  // Precompile the grammar using Shiki's actual precompiler
  const precompiled = precompileGrammar(languageRegistration)
  const precompiledStr = toJsLiteral(precompiled)

  // Generate output filename based on language name
  const outputFileName = `${languageInfo.name}-precompiled.mjs`

  // Generate the output .mjs file
  const output = `${precompiledStr.includes('new EmulatedRegExp') ? 'import { EmulatedRegExp } from \'oniguruma-to-es\'\n' : ''}
const lang = Object.freeze(${precompiledStr})

export default [lang]
`

  // Write the precompiled grammar to a file
  fs.writeFileSync(outputFileName, output, 'utf8')

  // eslint-disable-next-line no-console
  console.log(`✅ Successfully precompiled ${languageInfo.displayName} grammar!`)
  // eslint-disable-next-line no-console
  console.log(`📁 Output file: ${outputFileName}`)
  // eslint-disable-next-line no-console
  console.log(`🏷️  Language: ${languageInfo.name}`)
  // eslint-disable-next-line no-console
  console.log(`🎯 Scope: ${languageInfo.scopeName}`)
  if (languageInfo.aliases) {
    // eslint-disable-next-line no-console
    console.log(`🔗 Aliases: ${languageInfo.aliases.join(', ')}`)
  }
  // eslint-disable-next-line no-console
  console.log(`📄 File types: ${languageInfo.fileTypes.join(', ')}`)
  // eslint-disable-next-line no-console
  console.log('\n🚀 You can now use this with createHighlighterCore like this:')
  // eslint-disable-next-line no-console
  console.log(`
import { createHighlighterCore } from 'shiki'
import { createJavaScriptRawEngine } from '@shikijs/engine-javascript'
import ${languageInfo.name}Lang from './${outputFileName}'

const highlighter = await createHighlighterCore({
  themes: [/* your themes */],
  langs: [${languageInfo.name}Lang],
  engine: createJavaScriptRawEngine(),
})

const html = highlighter.codeToHtml('/* your ${languageInfo.name} code */', {
  lang: '${languageInfo.name}',
  theme: 'your-theme'
})
`)
}
catch (error) {
  console.error(`❌ Failed to precompile ${languageInfo.displayName} grammar:`, error)

  // Fallback: create a simpler version without precompilation
  const simpleOutputFileName = `${languageInfo.name}-simple.mjs`
  const simpleOutput = `const lang = Object.freeze(${JSON.stringify(languageRegistration, null, 2)})

export default [lang]
`
  fs.writeFileSync(simpleOutputFileName, simpleOutput, 'utf8')
  // eslint-disable-next-line no-console
  console.log(`📁 Created fallback file: ${simpleOutputFileName} (without regex precompilation)`)
}
