const playersOfDatabase = Object.keys(players)

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

function createAppearingLI(condition) {
	let li = document.createElement("li")
	let [label, tickbox] = createBoundCheckbox(li, condition)
	let span = createConditionSpan(condition)
	li.appendChild(label)
	li.appendChild(span)
	li.appendChild(tickbox)
	return li
}

function createBoundCheckbox(li, condition) {
	let input = createConditionInput()
	let label = createLabel()
	li.addEventListener("fieldUpdate", function() {
		input.checked = isVerified(condition)
		if (input.checked) {
			label.classList.add("reached")
			label.classList.remove("not-reached")
		} else {
			label.classList.add("not-reached")
			label.classList.remove("reached")
		}
	})
	return [label, input]
}

function createConditionInput() {
	let input = document.createElement("input")
	input.id = "condition-box"
	input.type = "checkbox"
	input.classList.add("condition-input")
	input.onclick = function(e) { e.preventDefault() }
	return input
}

function createConditionSpan(condition) {
	let span = document.createElement("span")
	span.innerHTML = stringify(condition)
	span.style.marginLeft = "2px"
	return span
}

function createLabel() {
	let label = document.createElement("label")
	label.htmlFor = "condition-box"
	label.classList.add("sbc-condition")
	label.classList.add("not-reached")
	return label
}

function mapConditions() {
	let field = document.getElementsByClassName("wrapper")[0]
	for (let condition of DOM_Validator.conditions) {
		let conditionLI = createAppearingLI(condition)
		document.getElementById("conditions-list").appendChild(conditionLI)
	}
}

function prepareField() {
	let overlay = document.getElementsByClassName("welcome")[0]
	let formation = overlay.querySelector("#formation").value
	overlay.parentNode.removeChild(overlay)
	document.getElementsByClassName("hoisted")[0].classList.remove("hoisted")
	mapConditions()
	generatePlayers()
}
