const test = require('./index')
const platform = process.platform

console.log('=== System Path Test ===');
console.log('Desktop path:', test.systemPath("desktop"));

// Platform-specific tests
if (platform === 'win32') {
  // Windows-specific tests
  console.log('\n=== Windows Drive List Test (PowerShell default) ===');
  console.log('Drive list (PowerShell):', test.driveList());

  console.log('\n=== Windows Drive List Test (Force wmic) ===');
  console.log('Drive list (wmic):', test.driveList(undefined, undefined, true));

  console.log('\n=== Windows Drive Type Tests ===');
  console.log('CD-ROM drives only (PowerShell):', test.driveList(5));
  console.log('CD-ROM drives only (wmic):', test.driveList(5, undefined, true));

  console.log('\n=== Removable drives only ===');
  console.log('Removable drives (PowerShell):', test.driveList(2));
  console.log('Removable drives (wmic):', test.driveList(2, undefined, true));

  console.log('\n=== Local drives only ===');
  console.log('Local drives (PowerShell):', test.driveList(3));
  console.log('Local drives (wmic):', test.driveList(3, undefined, true));

  console.log('\n=== Network drives only ===');
  console.log('Network drives (PowerShell):', test.driveList(4));
  console.log('Network drives (wmic):', test.driveList(4, undefined, true));

} else if (platform === 'darwin') {
  // macOS-specific tests
  console.log('\n=== macOS Drive List Test ===');
  console.log('Drive list:', test.driveList());

  console.log('\n=== macOS System Path Tests ===');
  console.log('Home path:', test.systemPath("home"));
  console.log('Downloads path:', test.systemPath("downloads"));
  console.log('Pictures path:', test.systemPath("pictures"));
  console.log('Music path:', test.systemPath("music"));
  console.log('Movies path:', test.systemPath("movies"));
  console.log('Documents path:', test.systemPath("documents"));

} else {
  // Other platforms (Linux, FreeBSD, etc.)
  console.log('\n=== Platform Info ===');
  console.log(`Current platform: ${platform}`);
  console.log('Drive list:', test.driveList());
  console.log('Home path:', test.systemPath("home"));
}

