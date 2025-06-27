'use strict'
const child = require('child_process');
const fs = require('fs');
const path = require('path');
const platform = process.platform

// For Windows
const Encoding = require('encoding-japanese');
const SJISToUTF8 = (bytes) => {
  return Encoding.convert(bytes, {
    from: 'SJIS',
    to: 'UNICODE',
    type: 'string',
  });
};

// Check if wmic exists
const existsWmic = () => {
  const sysRoot = process.env.SystemRoot || "C:\\Windows";
  const wmicPath = path.join(sysRoot, "System32", "wbem", "WMIC.exe");
  return fs.existsSync(wmicPath);
};

// Check if PowerShell exists
const existsPowershell = () => {
  const psPath = path.join(process.env.SystemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
  return fs.existsSync(psPath);
};

exports.systemPath = (function(type){
	switch(platform){
		case "darwin":
			switch(type){
				case "home": return child_exec("echo ~");
				case "desktop": return child_exec("echo ~/Desktop");
				case "pictures": return child_exec("echo ~/Pictures");
				case "downloads": return child_exec("echo ~/Downloads");
				case "music": return child_exec("echo ~/Music");
				case "movies": return child_exec("echo ~/Movies");
				case "documents": return child_exec("echo ~/Documents");
			}
			break;
		case "win32":
			var charcode = "@chcp 65001 >nul & cmd /d/s/c ";
			var home_cmd = "echo %USERPROFILE%";
			switch(type){
				case "home": return child_exec(charcode + home_cmd);
				case "desktop": return child_exec(charcode + home_cmd + "\\Desktop");
				case "pictures": return child_exec(charcode + home_cmd + "\\Pictures");
				case "downloads": return child_exec(charcode + home_cmd + "\\Downloads");
				case "music": return child_exec(charcode + home_cmd + "\\Music");
				case "movies": return child_exec(charcode + home_cmd + "\\Videos");
				case "documents": return child_exec(charcode + home_cmd + "\\Documents");
			}
			break;
		break;
	}
});
exports.driveList = (function(drive_type = undefined, drive_type_not = undefined, use_wmic = false){
	switch(platform){
		case "darwin":
			var cmd =" df -H | grep /dev/ | awk '{print $1}'"; // list up volumes
			var result = child.execSync(cmd).toString().trim(), 
				list = result.split("\n"), 
				list_len =list.length, 
				ret = [];
			for(var i = 0; i < list_len; i++){
				cmd = "diskutil info " + list[i].trim() + " | grep -e \"Device Location\" -e \"Mount Point\" -e \"Optical Media Type\" -e \"Media Type\" | sed -e 's/ / /g'"
				var tmp = child.execSync(cmd).toString().trim(), 
					tmp_list = tmp.split("\n"), 
					tmp_list_len = tmp_list.length, 
					mountPoint = "", 
					deviceLocation = "",
					mediaType = "",
					mediaType2 = "",
					external = false;
				for(var j = 0; j < tmp_list_len; j++){
					var pair = tmp_list[j].split(":");
					switch(pair[0].replace(/ /g, "")){
						case "MountPoint": mountPoint = pair[1].trim(); break;
						case "DeviceLocation": deviceLocation = pair[1].trim(); break;
						case "OpticalMediaType": mediaType = pair[1].trim(); break;
						case "MediaType": mediaType2 = pair[1].trim(); break;
						default: break;
					}
				}
				external = deviceLocation == "External";
				if(mediaType == "" && mediaType2 != ""){mediaType = mediaType2;}
				ret.push({name: mountPoint, desc: deviceLocation, external: external, mediaType: mediaType});
			} 
		return ret;
		case "win32":
			var ret = [];
			
			// Use wmic if explicitly requested or if PowerShell fails
			if (use_wmic || (!existsPowershell() && existsWmic())) {
				// Legacy wmic method
				var cond = "";
				if(drive_type !== undefined){
					cond = "where drivetype=" + parseInt(drive_type);
				}
				if(drive_type_not !== undefined){
					cond = "where drivetype!=" + parseInt(drive_type_not);
				}
				var charcode = "";//"@chcp 932 >nul & cmd /d/s/c ";
				var result = child.execSync(charcode + "wmic logicaldisk " + cond + " get description,name,volumename /format:csv");
				result = SJISToUTF8(result).trim();
				var list = result.replace(/\r\n/g, "\n").replace(/\r/g, "").split("\n"), 
					list_len = list.length, 
					description_index = 0, 
					name_index = 0, 
					volume_name_index = 0, 
					external = false;
				for(var i = 0; i < list_len; i++){
					var record = list[i].split(","), record_len = record.length;
					if(i == 0){
						for(var j = 0; j <= record_len; j++){
							switch(record[j]){
								case "Description": description_index = j; break;
								case "Name": name_index = j; break;
								case "VolumeName": volume_name_index = j; break;
								default: break;
							}
						}
					}
					external = record[description_index].indexOf("Disc") > -1 ||  
						record[description_index].indexOf("ROM") > -1 ||  
						record[description_index].indexOf("RAM") > -1 ||  
						record[description_index].indexOf("USB") > -1;
					ret.push({name: record[name_index], volume_name: record[volume_name_index], desc: record[description_index], external: external});
				}
			} else {
				// Modern PowerShell method
				try {
					var psCmd = `powershell -NoProfile -Command "Get-CimInstance Win32_LogicalDisk`;
					if(drive_type !== undefined){
						psCmd += ` | Where-Object {$_.DriveType -eq ${parseInt(drive_type)}}`;
					}
					if(drive_type_not !== undefined){
						psCmd += ` | Where-Object {$_.DriveType -ne ${parseInt(drive_type_not)}}`;
					}
					psCmd += ` | Select-Object DeviceID, VolumeName, MediaType, Description | ConvertTo-Csv -NoTypeInformation"`;
					
					var result = child.execSync(psCmd, { encoding: 'utf8' }).trim();
					var list = result.replace(/\r\n/g, "\n").split("\n");
					
					var device_id_index = 0;
					var volume_name_index = 0;
					var media_type_index = 0;
					var description_index = 0;
					
					for(var i = 0; i < list.length; i++){
						var record = list[i].split(",");
						if(i == 0){
							// Parse CSV header
							for(var j = 0; j < record.length; j++){
								var field = record[j].replace(/"/g, "");
								switch(field){
									case "DeviceID": device_id_index = j; break;
									case "VolumeName": volume_name_index = j; break;
									case "MediaType": media_type_index = j; break;
									case "Description": description_index = j; break;
									default: break;
								}
							}
						} else if(record.length > device_id_index){
							var name = record[device_id_index].replace(/"/g, "");
							var volume_name = record[volume_name_index].replace(/"/g, "");
							var media_type = parseInt(record[media_type_index]) || 0;
							var desc = record[description_index].replace(/"/g, "");
							
							// Determine if external based on media type
							var external = [2, 5, 6].includes(media_type); // Removable(2), CD-ROM(5), RAM(6)
							if(!external){
								// Fallback to description check
								external = desc.indexOf("Disc") > -1 ||  
									desc.indexOf("ROM") > -1 ||  
									desc.indexOf("RAM") > -1 ||  
									desc.indexOf("USB") > -1;
							}
							
							ret.push({name: name, volume_name: volume_name, desc: desc, external: external});
						}
					}
				} catch(error) {
					// If PowerShell fails, fallback to wmic
					console.warn("PowerShell method failed, falling back to wmic:", error.message);
					return exports.driveList(drive_type, drive_type_not, true);
				}
			}
		return ret;
	}
});
const child_exec = (function(cmd){
	return child.execSync(cmd).toString().trim();
});