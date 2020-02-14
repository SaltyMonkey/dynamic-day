
const { DateTime } = require("luxon");

const aeroData = require("./data/aero.json");
const tz = require("./data/tz.json");

class DynamicDayTime {
	constructor(mod) {
		const serverTZ = tz[mod.region];

		let intervalRef = undefined;
		let lastAero = undefined;
		let lastDayPart = undefined;

		const sendAero = (aero, blendTime) => {
			mod.send("S_AERO", 1, {
				"enabled": true,
				"blendTime": blendTime,
				"aeroSet": aero
			});
		};

		const resetAero = () => {
			mod.send("S_SPAWN_NPC", 11, {
				gameId: 696969696969,
				templateId: 8005000, 
				huntingZoneId: 1023,
				spawnScript: 105,
				visible: true
			})
			mod.send("S_DESPAWN_NPC", 3, {
				gameId: 696969696969,
				type: 1
			})
		}

		const applyAero = (aero, blendTime) => {
			resetAero();
			sendAero(aero, blendTime);
		};

		const getCurrentDayState = () => {
			let hours = 0;
			switch(mod.settings.timeType) {
				case("local"): hours = DateTime.local().hour; break;
				case("server"): hours = serverTZ ? DateTime.utc().setZone(serverTZ).hour : DateTime.local().hour; break;
				default : hours = DateTime.local().hour; break;
			}
			if ((hours >= 23 && hours <= 24) || (hours <= 4)) return "night";
			else if (hours >= 5 && hours <= 10) return "morning";
			else if (hours >= 11 && hours <= 16) return "day";
			else if (hours >= 17 && hours < 23) return "evening";
		}

		const generateAero = () => {
			let newDayPart = getCurrentDayState();

			if (newDayPart === lastDayPart) return;

			let arr = aeroData.enumAero[newDayPart];
			let newAero = arr[Math.floor(Math.random() * arr.length)];

			if (lastAero !== newAero) {
				lastAero = newAero;
				lastDayPart = newDayPart;

				applyAero(newAero, mod.settings.transitionTime)
			}
		};

		mod.hook("S_LOGIN", "event", () => { 
			intervalRef = mod.setInterval(generateAero, mod.settings.updateTryDelay);
		});

		mod.hook("S_RETURN_TO_LOBBY", "event", () => {
			mod.clearInterval(intervalRef);
		});
		
		mod.hook("S_SPAWN_ME", "event", () => {
			mod.setTimeout(()=> {
				if(lastAero === undefined)
					generateAero();
				else
					applyAero(lastAero, 1);
			}, mod.settings.delayAtSpawn);
		});

		
		mod.command.add("dn", {
			"$none": () => { mod.settings.timeType = mod.settings.timeType === "local" ? "server" : "local"; }
		})
	}
}

module.exports = DynamicDayTime;