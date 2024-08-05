// Needed for node < 22 support.

declare global {
  interface ImportMeta {
      /**
       * The directory name of the current module. This is the same as the `path.dirname()` of the `import.meta.filename`.
       * **Caveat:** only present on `file:` modules.
       */
      dirname: string;

      /**
       * The full absolute path and filename of the current module, with symlinks resolved.
       * This is the same as the `url.fileURLToPath()` of the `import.meta.url`.
       * **Caveat:** only local modules support this property. Modules not using the `file:` protocol will not provide it.
       */
      filename: string;

      /**
       * The absolute `file:` URL of the module.
       */
      url: string;
  }
}

export {};
