const playersOfDatabase = Object.keys(players)

/*document.getElementsByTagName("textarea")[0].onclick = function(e) {
	e.preventDefault()
	// one does not simply get a cursor blinking when he clicks
	// on the textarea.
	// This little piece should do the job.
}*/

const listHandler = (function() {
	let componentsList = {
		nations: {},
		clubs: {},
		leagues: {},
		qualities: {},
		editions: {}
	}

	let playersDataList = {}

	for (property in componentsList) {
		Object.defineProperty(componentsList[property], "count", {
			get: function() {
				return Object.keys(this).length
			}.bind(componentsList[property])
		})
	}

	let playersList = []

	return {
		addPlayer: function(newPlayer) {

			let [{
					name,
					club,
					league,
					nation
				},
				{
					edition,
					isSpecial,
					quality
				}] = [newPlayer.baseData, newPlayer.ig_data]
				// destructuring is an art

			isSpecial = isSpecial || false
			let playerData = { name, club, league, nation: nations[+nation], edition, isSpecial, quality }
			fillEntriesGaps(componentsList, playerData)
			appendToList(playersList, newPlayer)
			bindIndividualChemistry(newPlayer)
			playersDataList[name] = newPlayer
			incrementEntries(componentsList, playerData)
		},
		removePlayer: function(oldPlayer) {
			let [{
					name,
					club,
					league,
					nation
				},
				{
					edition,
					isSpecial,
					quality
				}] = [oldPlayer.baseData, oldPlayer.ig_data]

			isSpecial = isSpecial || false
			let neededData = { name, club, league, nation: nations[+nation], edition, isSpecial, quality }
			decrementEntries(componentsList, neededData)
			cleanMemory(componentsList)
			removeFromArray(playersList, oldPlayer)
			delete playersDataList[name]
		},
		serialize: function() {
			let serializedText = ""
			for (entry in componentsList) {
				serializedText += capitalize(entry) + ": \n"
				for (subEntry in componentsList[entry]) {
					serializedText += "\t- " + capitalize(subEntry) + ": " + (componentsList[entry][subEntry] || "none") + "\n"
				}
			}
			return serializedText
		},
		get componentsList() {
			return componentsList
		},
		get linearList() {
			return playersList.map(player => player.baseData.name)
		},
		get playersDataList() {
			return playersDataList
		},
		get teamChemistry() {
			return Array.prototype.map.call(this.playersDataList, (player => player.chemistry))
					.reduce((accumulator, value) => accumulator = Math.min(100, value + accumulator), 0)
		}
	}
})()

// Initialize values for specified nations / leagues / clubs, if they're different than what's already available
// Had this method not existed, we would be forced to check for each property and whether it exists or not.
// The check would happen in the listHandler.addPlayer method
//  
//                   v

function fillEntriesGaps(parentObject, objectToInsert) {
	if (!(objectToInsert.nation in parentObject.nations)) {
		parentObject.nations[objectToInsert.nation] = 0
	}

	if (!(objectToInsert.club in parentObject.clubs)) {
		parentObject.clubs[objectToInsert.club] = 0
	}

	if (!(objectToInsert.league in parentObject.leagues)) {
		parentObject.leagues[objectToInsert.league] = 0
	}

	if (!(objectToInsert.quality in parentObject.qualities)) {
		parentObject.qualities[objectToInsert.quality] = 0	
	}

	if (!(objectToInsert.edition in parentObject.editions)) {
		parentObject.editions[objectToInsert.edition] = 0	
	}

	if (!("specialness" in parentObject)) {
		parentObject.specialness = {}
		parentObject.specialness["true"] = 0
		parentObject.specialness["false"] = 0
	}
}

function incrementEntries(componentsList, neededData) {
	componentsList.nations[neededData.nation]++
	componentsList.clubs[neededData.club]++
	componentsList.leagues[neededData.league]++
	componentsList.qualities[neededData.quality]++
	componentsList.editions[neededData.edition]++
	componentsList.specialness[neededData.isSpecial.toString()]++
}

function decrementEntries(componentsList, neededData) {
	componentsList.nations[neededData.nation]--
	componentsList.clubs[neededData.club]--
	componentsList.leagues[neededData.league]--
	componentsList.qualities[neededData.quality]--
	componentsList.editions[neededData.edition]--
	componentsList.specialness[neededData.isSpecial.toString()]--
}

function cleanMemory(componentsList) {
	for (property in componentsList) {
		if (property !== "specialness") {
			for (subProperty in componentsList[property]) {
				if (componentsList[property][subProperty] === 0) delete componentsList[property][subProperty]
			}
		} else {
			for (trueness in componentsList.specialness) {
				if (componentsList.specialness[trueness] === 0) delete componentsList.specialness[trueness]
			}
		}
	}
}

function addNewPlayer() {}
