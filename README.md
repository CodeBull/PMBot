# PMBot

PMBot is a workshop manager bot for @promo-mentors.

## Commands

**`$add-mentor`** adds a mentor

Format: `$add-mentor [@DISCORD NAME] [STEEM USERNAME]`

Example: `$add-mentor @futurethinker futurethinker`


**`$add-workshop`** adds a new workshop

Format: `$add-workshop ['TITTLE'] [#CHANNEL] [@MENTOR] [WEEKDAY] [TIME] [PRICE]`

Example: `$add-workshop 'Feedback workshop' #general-feedback-session @futurethinker Saturday 09:00-11:00 0.001 SBD`


**`$open-workshop`** opens a workshop

Format: `$open-workshop [WORKSHOP ID]`

Example: `$open-workshop 4325`


**`$close-workshop`** closes a workshop

Format: `$close-workshop [WORKSHOP ID]`

Example: `$close-workshop 4325`


**`$show-message`** shows a predefined message

Format: `$show-message [TYPE]`

Example: `$show-message closing`


**`$show-message closing`** shows closing message


**`$schedule`** shows the list of workshops


**`$join-workshop`** subscribes to a workshop

Format: `$join-workshop [WORKSHOP ID]`

Example: `$join-workshop 4325`


**`$tip`** generates a link to tip a mentor

Format: `$tip [MENTOR] [AMOUNT]`

Example: `$tip @futurethinker 1 SBD`


## Technologies

- Node JS
- Discord.JS
- Discord.JS-commando
- MongoDB
- dSteem

## Roadmap

* Workshop edit/delete/pause/resume commands
* Mentor delete/update commands
* Stats generator commands
* Some automation e.g. payment auto validation

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue or Discord with me. But you are free to make your own copy and use it.
