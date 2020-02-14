# Dynamic day

Dynamic day is simple Tera Toolbox module which adds a dynamic environment to Tera Online based on the player’s local or server time.

## Installation

Manual installation:
- Create a folder called `dynamic-day` in `<tera-toolbox>/mods`, download current repository and place it in created folder

Automatic installation 2:
- Open Tera Toolbox, open `Get More Mods` tab and install it as simple mod.

## Usage

By default player local time will be used. 

You can change this behavior with command `/8 dn`

## Settings

-	"timeType": "local" or "server" - aero based on local time or server
-	"updateTryDelay": 1800000 - aero change try delay (30mins by default, value in milliseconds)
-	"delayAtSpawn": 3000 - fix for broken aero with slow pcs
-	"transitionTime": 5 - switch abstract value (no clue what is dat, 1 is fast, 10 is slow :) )

## Credits 

- [HugeDong69](https://github.com/codeagon) original idea in past
