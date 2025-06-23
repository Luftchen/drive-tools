# drive-tools

` drive-tools` is a Node.js package for listing drives and getting system path (Desktop, Downloads, and etc).

Current version supports **MacOS** and **Windows**;

## Install

```bash
npm install drive-tools
```

## Usage

```js
const driveTools = require('drive-tools')

console.log(driveTools.systemPath("desktop"));
// Available: home, desktop, pictures, downloads, music, movies, documents

console.log(driveTools.driveList());
```

## driveTools.driveList
The return value is an Array, looks like:

```
[
  { name: '/', desc: 'Internal', external: false },
  { name: '/System/Volumes/Data', desc: 'Internal', external: false },
,
  { name: '/Volumes/USB-Drive', desc: 'External', external: true }
]
```

Only for Windows, It's able to specity drive type.

```
0 = Unknown
1 = No Root Directory
2 = Removable Disk
3 = Local Disk
4 = Network Drive
5 = Compact Disc
6 = RAM Disk
```

For example, if you want to listup only CD-ROM drive,

console.log(driveTools.driveList(5));

```
[ { name: 'Name', desc: 'Description', external: false },
  { name: 'D:', desc: 'CD-ROM Disc', external: true } ]
```

## Required
Please install encoding-japanese.
npm install encoding-japanese

## Repository Migration Notice
This package has been migrated to GitHub. The npm package will continue to work as before, but the source code is now available at: https://github.com/Luftchen/drive-tools

## Support
Meteoric Stream: https://meteoricstream.com/

## History
2020-06-19(0.0.1): created beta version
2020-06-19(0.0.11): bug fix
2020-06-24(0.0.12): added driveTools.systemPath("home")
2020-06-25(0.0.14): bug fix
2020-07-01(0.0.15): bug fix
2020-07-12(0.0.16): added drive type paramater for driveList() (only for windows)
2020-07-12(0.0.17): bug fix
2020-07-29(0.0.18): added MediaType only for Mac
2021-05-10(0.0.19): bug fix
2021-06-03(0.0.20): bug fix
2025-06-24(0.0.21): migrated repository to GitHub, added proper package.json metadata
