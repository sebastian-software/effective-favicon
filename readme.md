# Effective Favicon Generator

A compact tool for generating a comprehensive set of modern favicons. Simply provide a folder containing SVG files (a single SVG file is also acceptable), and the generator will automatically produce the recommended favicon variants based on [How to Favicon in 2024: Six files that fit most needs](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs).

## Usage

```bash
effective-favicon <directory>
```

The command expects one or more SVG files within the specified directory. It generates various output files using the same base name with different postfixes and extensions. For example:

Given one source file e.g.:

`awesome-company.svg`

these assets are created dynamically in the same folder:

- **Optimized SVG Icon:** `awesome-company-opt.svg` - an optimized version of the source SVG.
- **Classic Favicon:** `awesome-company.ico` - includes 16px and 32px icons.
- **Apple Touch Icon:** `awesome-company-180.png`
- **Web Manifest Icons:**
  - `awesome-company-192.png`
  - `awesome-company-512.png`
- **ReactComponent:** `AwesomeCompany.tsx` - for registering all created assets

## Command Line Interface

```sh
effective-favicon <fileOrFolder> [options]
```

### Arguments

- `<fileOrFolder>`: The file or folder to process (required).

### Options

- `--png-quality <quality>`: Set PNG quality. Default is `95`.
- `--manifest-icon-sizes <sizes>`: Set manifest icon sizes (comma-separated). Default is `"192,512"`.
- `--apple-icon-sizes <sizes>`: Set Apple icon sizes (comma-separated). Default is `"152,167,180"`.
- `--fav-icon-sizes <sizes>`: Set favicon sizes (comma-separated). Default is `"16,32"`.

### Examples

#### Basic Usage

Process a file or folder with default settings:

```sh
effective-favicon myFolder
```

#### Custom PNG Quality

Specify custom PNG quality:

```sh
effective-favicon myFolder --png-quality 70-80
```

#### Custom Icon Sizes

Specify custom icon sizes:

```sh
effective-favicon myFolder --manifest-icon-sizes 144,256 --apple-icon-sizes 120,144,180 --fav-icon-sizes 16,48
```

### Help

For more information, use the help flag:

```sh
effective-favicon --help
```

This will display detailed usage information and available options.

## Tech Stack

- **[sharp](https://sharp.pixelplumbing.com/):** Image resizing and conversion. Sharp is a high-performance image processing library that allows for fast and efficient image manipulation.
- **[svgo](https://github.com/svg/svgo):** SVG optimization. SVGO is a Node.js-based tool for optimizing SVG vector graphics files, reducing their size without compromising quality.

## License

[Apache License; Version 2.0, January 2004](http://www.apache.org/licenses/LICENSE-2.0)

## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/0d4ec9d6/sebastiansoftware-en.svg" alt="Logo of Sebastian Software GmbH, Mainz, Germany" width="460" height="160"/>

Copyright 2023-2024<br/>[Sebastian Software GmbH](https://www.sebastian-software.de)
