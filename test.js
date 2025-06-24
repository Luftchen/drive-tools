const assert = require('assert');
const driveTools = require('./index');
const platform = process.platform;

console.log('Running drive-tools tests...\n');

// Test systemPath function
console.log('Testing systemPath function...');
try {
  const desktopPath = driveTools.systemPath("desktop");
  assert(typeof desktopPath === 'string', 'systemPath should return a string');
  assert(desktopPath.length > 0, 'systemPath should return non-empty string');
  console.log('✅ systemPath test passed');
} catch (error) {
  console.log('❌ systemPath test failed:', error.message);
}

// Test driveList function
console.log('\nTesting driveList function...');
try {
  const driveList = driveTools.driveList();
  assert(Array.isArray(driveList), 'driveList should return an array');
  assert(driveList.length >= 0, 'driveList should return array with non-negative length');
  
  // Check structure of first drive if exists
  if (driveList.length > 0) {
    const firstDrive = driveList[0];
    assert(typeof firstDrive === 'object', 'Drive should be an object');
    assert('name' in firstDrive, 'Drive should have name property');
    assert('desc' in firstDrive, 'Drive should have desc property');
    assert('external' in firstDrive, 'Drive should have external property');
    assert(typeof firstDrive.external === 'boolean', 'external should be boolean');
  }
  console.log('✅ driveList test passed');
} catch (error) {
  console.log('❌ driveList test failed:', error.message);
}

// Platform-specific tests
if (platform === 'win32') {
  console.log('\nTesting Windows-specific features...');
  
  // Test wmic fallback
  try {
    const wmicDriveList = driveTools.driveList(undefined, undefined, true);
    assert(Array.isArray(wmicDriveList), 'wmic driveList should return an array');
    console.log('✅ wmic fallback test passed');
  } catch (error) {
    console.log('❌ wmic fallback test failed:', error.message);
  }
  
  // Test drive type filtering
  try {
    const localDrives = driveTools.driveList(3); // Local drives
    assert(Array.isArray(localDrives), 'Drive type filter should return an array');
    console.log('✅ drive type filter test passed');
  } catch (error) {
    console.log('❌ drive type filter test failed:', error.message);
  }
  
} else if (platform === 'darwin') {
  console.log('\nTesting macOS-specific features...');
  
  // Test additional system paths
  try {
    const paths = ['home', 'downloads', 'pictures', 'music', 'movies', 'documents'];
    paths.forEach(path => {
      const result = driveTools.systemPath(path);
      assert(typeof result === 'string', `${path} path should return a string`);
      assert(result.length > 0, `${path} path should return non-empty string`);
    });
    console.log('✅ macOS system paths test passed');
  } catch (error) {
    console.log('❌ macOS system paths test failed:', error.message);
  }
}

console.log('\n🎉 All tests completed!');