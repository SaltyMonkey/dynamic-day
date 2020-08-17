# Dynamic day

Dynamic day is simple Tera Toolbox module which adds a dynamic environment to Tera Online based on the player’s local or server time.

## Installation

Manual installation:
- Create a folder called `dynamic-day` in `<tera-toolbox>/mods`, download current repository and place it in created folder

Automatic installation 2:
- Open Tera Toolbox, open `Get More Mods` tab and install it as simple mod.

## Usage

Working out of box. By default player local time will be used. 

## Commands

/8 dn type <type> (local, server or static) - change type of time change, static means you want configure mod to use one desired day part, as example night 

/8 dn day <day part> (night, night-weather, morning, morning-weather, day, day-weather or evening, evening-weather) - setup current day part

/8 dn roll - change current aero randomly to next for current day part

/8 dn weather - disable/enable weather usage from next aero switch


## Settings

-	"timeType": "local" or "server" - aero based on local time or server
-	"updateTryDelay": 1800000 - aero change try delay (30mins by default, value in milliseconds)
-	"delayAtSpawn": 3000 - fix for broken aero with slow pcs
-	"transitionTime": 5 - switch abstract value (no clue what is dat, 1 is fast, 10 is slow :) )

## Credits 

- Beng - for hard work and effects test for this mod.

- [HugeDong69](https://github.com/codeagon) original idea in past
