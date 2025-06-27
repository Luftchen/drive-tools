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

## Testing

Run the test suite:

```bash
npm test
```

For detailed output and debugging:

```bash
npm run test:sandbox
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

For example, if you want to list up only CD-ROM drive:

```js
console.log(driveTools.driveList(5));
```

```js
[ 
  { name: 'Name', desc: 'Description', external: false },
  { name: 'D:', desc: 'CD-ROM Disc', external: true } 
]
```

### Windows PowerShell Support
On Windows, this package now uses PowerShell by default for better compatibility and performance. If PowerShell is not available or fails, it automatically falls back to the legacy wmic method.

You can also force the use of wmic by passing `true` as the third parameter:

```js
// Force use of wmic (legacy method)
console.log(driveTools.driveList(undefined, undefined, true));
```

## Required
Please install encoding-japanese.
npm install encoding-japanese

## Repository Migration Notice
This package has been migrated to GitHub. The npm package will continue to work as before, but the source code is now available at: https://github.com/Luftchen/drive-tools

## Support
```
Zelda, inc : https://zeldainc.com/
Author : Hiroki Tanaka (@Luftchen)
X : https://x.com/hrktnk
```

## History
```
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
2025-06-24(0.0.22): added PowerShell support for Windows with wmic fallback, added use_wmic flag
2025-06-27(0.0.23, 0.0.24): bug fix
```