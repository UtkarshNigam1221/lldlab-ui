import { Prism } from 'prism-react-renderer';

// prism-react-renderer bundles no Java or Bash grammar; define small ones instead of adding prismjs.
if (!Prism.languages.java) {
  Prism.languages.java = Prism.languages.extend('clike', {
    keyword:
      /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|record|return|sealed|short|static|super|switch|synchronized|this|throw|throws|transient|try|var|void|volatile|while|yield)\b/,
    'class-name': /\b[A-Z]\w*\b/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?[dfl]?/i,
  });
  Prism.languages.insertBefore('java', 'keyword', { annotation: { pattern: /@\w+/, alias: 'punctuation' } });
}
if (!Prism.languages.bash) {
  Prism.languages.bash = {
    comment: { pattern: /(^|\s)#.*/, lookbehind: true },
    string: [/"(?:\\.|[^"\\])*"/, /'[^']*'/],
    variable: /\$(?:\w+|\{[^}]+\})/,
    function: /\b(?:cd|echo|export|go|npm|npx|node|python3?|pip|git|ls|cat|curl|make)\b/,
    operator: /&&|\|\||[|;<>]/,
    punctuation: /[{}()[\]]/,
  };
}

const ALIAS: Record<string, string> = {
  ts: 'typescript', typescript: 'typescript', tsx: 'tsx', js: 'javascript', javascript: 'javascript', jsx: 'jsx',
  py: 'python', python: 'python', go: 'go', golang: 'go', java: 'java', json: 'json', bash: 'bash', sh: 'bash', shell: 'bash',
};

/** Prism language id for an alias, or undefined when no grammar is available. */
export function resolveLanguage(lang?: string): string | undefined {
  const id = lang ? ALIAS[lang.toLowerCase()] : undefined;
  return id && Prism.languages[id] ? id : undefined;
}

const TOKEN_CLASS: Record<string, string> = {
  keyword: 'text-code-keyword', builtin: 'text-code-keyword', tag: 'text-code-keyword', important: 'text-code-keyword',
  boolean: 'text-code-number', number: 'text-code-number', constant: 'text-code-number',
  string: 'text-code-string', char: 'text-code-string', 'template-string': 'text-code-string', 'attr-value': 'text-code-string', regex: 'text-code-string',
  comment: 'text-code-comment italic', prolog: 'text-code-comment italic', doctype: 'text-code-comment italic',
  function: 'text-code-function', 'function-variable': 'text-code-function', variable: 'text-code-function',
  'class-name': 'text-code-type', 'maybe-class-name': 'text-code-type', 'attr-name': 'text-code-type', property: 'text-code-type',
  operator: 'text-code-punctuation', punctuation: 'text-code-punctuation',
};

/** Class for the most specific known Prism token type (types are ordered general → specific). */
export function tokenClass(types: string[]): string {
  for (let i = types.length - 1; i >= 0; i--) {
    const c = TOKEN_CLASS[types[i]];
    if (c) return c;
  }
  return '';
}

export { Prism };
