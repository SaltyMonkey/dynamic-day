
const { DateTime } = require("luxon");

const aeroData = require("./data/aero.json");
const tz = require("./data/tz.json");

const allowedTimeType = ["local", "server", "static"];
const allowedDayPart = ["night", "night-weather", "morning", "morning-weather", "day", "day-weather", "evening", "evening-weather"];

class DynamicDayTime {
	constructor(mod) {
		mod.game.initialize("me");

		const serverTZ = tz[mod.publisher];

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
			if(mod.game.me.inDungeon) return;
			resetAero();
			sendAero(aero, blendTime);
		};

		const getCurrentDayState = () => {
			let hours = 0;
			switch(mod.settings.timeType) {
				case("local"): hours = DateTime.local().hour; break;
				case("server"): hours = serverTZ ? DateTime.utc().setZone(serverTZ).hour : DateTime.local().hour; break;
				case("static"): return mod.settings.staticTime;
				default : hours = DateTime.local().hour; break;
			}
			if ((hours >= 23) || (hours <= 4)) return mod.settings.useWeather ? "night-weather" : "night";
			else if (hours >= 5 && hours <= 10) return mod.settings.useWeather ? "morning-weather" :"morning";
			else if (hours >= 11 && hours <= 16) return mod.settings.useWeather ? "day-weather" : "day";
			else if (hours >= 17 && hours < 23) return mod.settings.useWeather ? "evening-weather" : "evening";
		}

		const generateAero = (force = false) => {
			let newDayPart = getCurrentDayState();

			if (!force && newDayPart === lastDayPart) return;

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
			"type": (type) => { 
				if (!allowedTimeType.includes(type)) {
					mod.command.message("Invalid time type parameter!");
					return;
				}
				mod.settings.timeType = type;
				mod.command.message(`Time type changed to "${mod.settings.timeType}"`)
			},
			"day": (daypart) => {
				if(mod.settings.timeType !== "static") {
					mod.command.message("You can't manually change current status - time type is not static");
					return;
				}

				if(!allowedDayPart.includes(daypart)) {
					mod.command.message("Invalid day type parameter!");
					return;
				}
				
				mod.settings.staticTime = daypart;
				generateAero(true);
			},
			"weather": () => {
				mod.settings.useWeather = !mod.settings.useWeather;
				mod.command.message(`Apply weather: ${mod.settings.useWeather}`);
			},
			"roll": () => {
				mod.command.message("Applying different aero based on day time");
				generateAero(true);
			}
		})
	}
}

module.exports = DynamicDayTime;