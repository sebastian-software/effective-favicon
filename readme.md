# Effective Favicon Generator

A compact tool for generating a comprehensive set of modern favicons. Simply provide a folder containing SVG files (a single SVG file is also acceptable), and the generator will automatically produce the recommended favicon variants based on [How to Favicon in 2024: Six files that fit most needs](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs).

## Usage

```bash
effective-favicon <directory>
```

The command expects one or more SVG files within the specified directory. It generates various output files using the same base name with different postfixes and extensions. For example:

### Source

`awesome-company.svg`

### Output

- **Optimized SVG Icon:** `awesome-company-opt.svg` - an optimized version of the source SVG.
- **Classic Favicon:** `awesome-company.ico` - includes 16px and 32px icons.
- **Apple Touch Icon:** `awesome-company-180.png`
- **Web Manifest Icons:**
  - `awesome-company-192.png`
  - `awesome-company-512.png`

## Tech Stack

- **sharp:** Used for image resizing and conversion.
- **pngquant:** Utilized for PNG optimization.
- **png-to-ico:** Handles ICO file generation.
- **svgo:** Ensures SVG optimization.

## License

[Apache License; Version 2.0, January 2004](http://www.apache.org/licenses/LICENSE-2.0)

## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/0d4ec9d6/sebastiansoftware-en.svg" alt="Logo of Sebastian Software GmbH, Mainz, Germany" width="460" height="160"/>

Copyright 2023-2024<br/>[Sebastian Software GmbH](https://www.sebastian-software.de)
