/**
 * JSX/HTML attribute conversion utilities
 */

/**
 * Convert JSX attributes to HTML attributes
 * className → class, htmlFor → for, etc.
 */
export function jsxToHtmlAttributes(jsxCode: string): string {
  return (
    jsxCode
      .replace(/className=/g, 'class=')
      .replace(/htmlFor=/g, 'for=')
      .replace(/tabIndex=/g, 'tabindex=')
      .replace(/readOnly=/g, 'readonly=')
      .replace(/maxLength=/g, 'maxlength=')
      .replace(/minLength=/g, 'minlength=')
      .replace(/autoComplete=/g, 'autocomplete=')
      .replace(/autoFocus=/g, 'autofocus=')
      .replace(/spellCheck=/g, 'spellcheck=')
      .replace(/contentEditable=/g, 'contenteditable=')
      .replace(/strokeWidth=/g, 'stroke-width=')
      .replace(/strokeLinecap=/g, 'stroke-linecap=')
      .replace(/strokeLinejoin=/g, 'stroke-linejoin=')
      .replace(/defaultValue=/g, 'value=')
      .replace(/defaultChecked=/g, 'checked=')
      // Convert camelCase data attributes to kebab-case (data-testId → data-test-id)
      .replace(/data-([a-z])([A-Z])/g, (match, p1, p2) => `data-${p1}-${p2.toLowerCase()}`)
      // Convert camelCase aria attributes to lowercase (aria-labelledBy → aria-labelledby)
      .replace(/aria-([a-zA-Z]+)/g, (match, p1) => `aria-${p1.toLowerCase()}`)
      // Handle boolean attributes (disabled, required, etc.) - remove ={true} BEFORE converting to ="true"
      .replace(
        /\s+(disabled|required|readonly|checked|selected|autofocus|autoplay|controls|loop|muted|hidden|multiple|defer|async|novalidate|open|reversed|inert|itemscope)=\{(true|false)\}/g,
        (match, attr, value) => {
          return value === 'true' ? ` ${attr}` : '';
        }
      )
      // Handle boolean JSX expressions for non-boolean attributes
      .replace(/=(\{true\})/g, '="true"')
      .replace(/=(\{false\})/g, '="false"')
  );
}

/**
 * Convert React event handlers to lowercase HTML event attributes
 * onClick → onclick, onChange → onchange, etc.
 */
export function reactEventsToHtml(jsxCode: string): string {
  return jsxCode
    .replace(/onClick=/g, 'onclick=')
    .replace(/onChange=/g, 'onchange=')
    .replace(/onSubmit=/g, 'onsubmit=')
    .replace(/onFocus=/g, 'onfocus=')
    .replace(/onBlur=/g, 'onblur=')
    .replace(/onKeyDown=/g, 'onkeydown=')
    .replace(/onKeyUp=/g, 'onkeyup=')
    .replace(/onKeyPress=/g, 'onkeypress=')
    .replace(/onMouseEnter=/g, 'onmouseenter=')
    .replace(/onMouseLeave=/g, 'onmouseleave=')
    .replace(/onMouseDown=/g, 'onmousedown=')
    .replace(/onMouseUp=/g, 'onmouseup=')
    .replace(/onInput=/g, 'oninput=');
}

/**
 * Convert React event handlers to Svelte event syntax
 * onClick → on:click, onChange → on:change, etc.
 */
export function reactEventsToSvelte(jsxCode: string): string {
  return jsxCode
    .replace(/onClick=/g, 'on:click=')
    .replace(/onChange=/g, 'on:change=')
    .replace(/onSubmit=/g, 'on:submit=')
    .replace(/onFocus=/g, 'on:focus=')
    .replace(/onBlur=/g, 'on:blur=')
    .replace(/onKeyDown=/g, 'on:keydown=')
    .replace(/onKeyUp=/g, 'on:keyup=')
    .replace(/onKeyPress=/g, 'on:keypress=')
    .replace(/onMouseEnter=/g, 'on:mouseenter=')
    .replace(/onMouseLeave=/g, 'on:mouseleave=')
    .replace(/onMouseDown=/g, 'on:mousedown=')
    .replace(/onMouseUp=/g, 'on:mouseup=')
    .replace(/onInput=/g, 'on:input=');
}

/**
 * Remove JSX-specific syntax (fragments, self-closing tags without content)
 */
export function cleanJsxSyntax(jsxCode: string): string {
  return jsxCode
    .replace(/<>\s*/g, '')
    .replace(/\s*<\/>/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ''); // Remove JSX comments (including multiline)
}

/**
 * Full JSX to HTML conversion
 */
export function jsxToHtml(jsxCode: string): string {
  let result = jsxCode;
  result = jsxToHtmlAttributes(result);
  result = reactEventsToHtml(result);
  result = cleanJsxSyntax(result);
  return result;
}

/**
 * Full JSX to Svelte conversion
 */
export function jsxToSvelte(jsxCode: string): string {
  let result = jsxCode;
  result = jsxToHtmlAttributes(result);
  result = reactEventsToSvelte(result);
  result = cleanJsxSyntax(result);
  return result;
}

/**
 * Convert HTML attributes object to JSX attributes string
 */
export function htmlToJsxAttributes(attributes: Record<string, string>): string {
  return Object.entries(attributes)
    .map(([key, value]) => {
      // Convert HTML attributes back to JSX
      const jsxKey = key
        .replace(/class=/g, 'className=')
        .replace(/for=/g, 'htmlFor=')
        .replace(/tabindex=/g, 'tabIndex=')
        .replace(/readonly=/g, 'readOnly=')
        .replace(/maxlength=/g, 'maxLength=')
        .replace(/minlength=/g, 'minLength=')
        .replace(/autocomplete=/g, 'autoComplete=')
        .replace(/autofocus=/g, 'autoFocus=')
        .replace(/spellcheck=/g, 'spellCheck=')
        .replace(/contenteditable=/g, 'contentEditable=')
        .replace(/stroke-width=/g, 'strokeWidth=')
        .replace(/stroke-linecap=/g, 'strokeLinecap=')
        .replace(/stroke-linejoin=/g, 'strokeLinejoin=');
      
      return `${jsxKey}"${value}"`;
    })
    .join(' ');
}

/**
 * Convert style object to CSS string
 */
export function convertStyleObjectToString(styleObject: Record<string, string | number>): string {
  return Object.entries(styleObject)
    .map(([property, value]) => {
      // Convert camelCase to kebab-case
      const cssProperty = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      return `${cssProperty}: ${value}`;
    })
    .join('; ');
}

/**
 * Parse style string to object
 */
export function parseStyleString(styleString: string): Record<string, string> {
  const styles: Record<string, string> = {};
  
  if (!styleString) return styles;
  
  styleString.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim());
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      styles[camelCaseProperty] = value;
    }
  });
  
  return styles;
}
