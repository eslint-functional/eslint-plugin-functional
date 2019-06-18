export interface Options {
  readonly [key: string]: boolean | string;
}

export interface MutableOptions {
  [key: string]: boolean | string;
}

/**
 * Converts ruleArguments in format
 * ["foo-bar", {do-it: "foo"}, "do-not-do-it"]
 * to options in format
 * {fooBar: true, doIt: "foo", doNotDoIt: true}
 */
// tslint:disable-next-line:no-any
export function parseOptions<TOptions>(ruleArguments: any[]): TOptions {
  let options: MutableOptions = {};
  for (const o of ruleArguments) {
    if (typeof o === "string") {
      options[camelize(o)] = true;
    } else if (typeof o === "object") {
      const o2: MutableOptions = {};
      for (const key of Object.keys(o)) {
        o2[camelize(key)] = o[key];
      }
      options = { ...options, ...o2 };
    }
  }
  // tslint:disable-next-line:no-any
  return options as any;
}

function upFirst(word: string): string {
  return word[0].toUpperCase() + word.toLowerCase().slice(1);
}

function camelize(text: string): string {
  let words = text.split(/[-_]/g);
  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map(upFirst)
      .join("")
  );
}
