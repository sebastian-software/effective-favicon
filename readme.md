## Effective Favicon Generator

A small generator for a modern set of typical favicons. Expected a folder of svg files (only one is okay as well) and generates the variants suggested by (How to Favicon in 2023: Six files that fit most needs)[https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs] automatically.

## Usage

`effective-favicon <directory>`

Expects one or many SVG files somewhere in this directory. It writes all output files using the same base name but with different postfixes/extensions e.g.:

Source: `icon-myproduct.svg`
Output:

- SVG Icon: `icon-opt.svg` optimized SVG of source image.
- Classic Favicon: `icon-myproduct.ico` with 16px and 32px icons embedded.
- Apple Touch Icon: `icon-myproduct-180.png`
- Web Manifest: `icon-myproduct-192.png` + `icon-myproduct-512.png`

## Tech Stack

- `sharp` for image resizing/conversion
- `pngquant` for PNG optimization
- `png-to-ico` for ICO file generation
- `svgo` for SVG optimization

## License

[Apache License; Version 2.0, January 2004](http://www.apache.org/licenses/LICENSE-2.0)

## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/0d4ec9d6/sebastiansoftware-en.svg" alt="Logo of Sebastian Software GmbH, Mainz, Germany" width="460" height="160"/>

Copyright 2023<br/>[Sebastian Software GmbH](https://www.sebastian-software.de)
