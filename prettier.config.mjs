/** @type {import('prettier').Config} */
const config = {
    // Code style
    semi: true,
    singleQuote: true,
    jsxSingleQuote: true, // Use single quotes in JSX attributes for consistency
    printWidth: 100, // Common choice for modern screens (80, 100, or 120)
    tabWidth: 4, // 4 spaces for better readability
    useTabs: false, // Use spaces, not tabs (standard for JS/TS)

    // Formatting
    trailingComma: 'all', // Better git diffs and easier refactoring
    bracketSpacing: true, // { foo: bar } instead of {foo: bar}
    bracketSameLine: false, // JSX closing bracket on new line
    arrowParens: 'avoid', // x => x instead of (x) => x when possible

    // Line endings
    endOfLine: 'lf', // Unix-style line endings (cross-platform compatibility)

    // Additional options (prettier defaults, but explicit for clarity)
    quoteProps: 'as-needed', // Only add quotes to object properties when needed
    proseWrap: 'preserve', // Don't wrap markdown prose
    htmlWhitespaceSensitivity: 'css', // Respect CSS display property
    embeddedLanguageFormatting: 'auto', // Format code in template literals
};

export default config;
