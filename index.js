'use strict'
const child = require('child_process');
const platform = process.platform
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
			//			var charcode =  "chcp 65001 | ";
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
exports.driveList = (function(drive_type = undefined){
	switch(platform){
		case "darwin":
			var cmd =" df -H | grep /dev/ | awk '{print $1}'"; // list up volumes
			var result = child.execSync(cmd).toString().trim(), 
				list = result.split("\n"), 
				list_len =list.length, 
				ret = [];
			for(var i = 0; i < list_len; i++){
				cmd = "diskutil info " + list[i].trim() + " | grep -e \"Device Location\" -e \"Mount Point\" -e \"Optical Media Type\" | sed -e 's/ //g' | awk -F':' '{print $1,$2,$3}'"
				var tmp = child.execSync(cmd).toString().trim(), 
					tmp_list = tmp.split("\n"), 
					tmp_list_len = tmp_list.length, 
					mountPoint = "", 
					deviceLocation = "",
					mediaType = "",
					external = false;
				for(var j = 0; j < tmp_list_len; j++){
					var pair = tmp_list[j].split(" ");
					switch(pair[0]){
						case "MountPoint": mountPoint = pair[1]; break;
						case "DeviceLocation": deviceLocation = pair[1]; break;
						case "OpticalMediaType": mediaType = pair[1]; break;
						default: break;
					}
				}
				external = deviceLocation == "External";
				ret.push({name: mountPoint, desc: deviceLocation, external: external, mediaType: mediaType});
			} 
		return ret;
		case "win32":
			var cond = "";
			if(drive_type !== undefined){
				cond = "where drivetype=" + parseInt(drive_type);
			}
			var result = child.execSync("wmic logicaldisk " + cond + " get description,name /format:csv").toString().trim(), 
				list = result.replace(/\r\n/g, "\n").replace(/\r/g, "").split("\n"), 
				list_len = list.length, 
				description_index = 0, 
				name_index = 0, 
				ret = [],
				external = false;
			for(var i = 0; i < list_len; i++){
				var record = list[i].split(","), record_len = record.length;
				if(i == 0){
					for(var j = 0; j <= record_len; j++){
						switch(record[j]){
							case "Description": description_index = j; break;
							case "Name": name_index = j; break;
							default: break;
						}
					}
				}
				external = record[description_index].indexOf("Disc") > -1 ||  
					record[description_index].indexOf("ROM") > -1 ||  
					record[description_index].indexOf("RAM") > -1 ||  
					record[description_index].indexOf("USB") > -1;
				ret.push({name: record[name_index], desc: record[description_index], external: external});
			}
		return ret;
	}
});
const child_exec = (function(cmd){
	return child.execSync(cmd).toString().trim();
});