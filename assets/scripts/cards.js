function createBlankCard() {
	let containerDiv = document.createElement("div")
	containerDiv.classList.add("in-field")
	containerDiv.classList.add("blank")
	containerDiv.onclick = function() {
		addNewPlayer(this)
	}
}

function createPlayerCard(player, isInField) {
	listHandler.addPlayer(player)
	let containerDiv = fillDivContent(player)
	if (isInField === true) { 
		containerDiv.classList.add("in-field")
		containerDiv.appendChild(generateXButton(player))
	}

	return containerDiv
}

function fillDivContent(player) {
	let sideBar = generateSidebar(player)
	let cardMainSpace = generateMainCardSpace(player)
	return combine(sideBar, cardMainSpace, player)
}

function combine() {
	let args = Array.prototype.slice.call(arguments)
	// For scalability purposes, we need to treat
	// the number of arguments as if it might
	// change in the future
	// the last argument should always be the player
	// whose data is getting represented in the cooked DOM
	const player = args.pop()
	let div = document.createElement("div")
	div.classList.add("player-card")
	// In order to properly receive the X button that should be overlapping that div,
	// this .player-card class has a relative position and a 0 z-index.
	// I love z-index.
	div.classList.add(getDivClass(player.ig_data.edition, player.ig_data.quality))
	for (i = 0; i < args.length; i++) {
		div.appendChild(args[i])
	}
	let bothClearer = document.createElement("div")
	bothClearer.style.clear = "both"
	div.appendChild(bothClearer)
	return div
}

function generateSidebar(player) {
	let div = document.createElement("div")
	div.classList.add("sidebar")
	return fillSidebar(div, player)
}

function generateMainCardSpace(player) {
	let div = document.createElement("div")
	div.classList.add("card")
	div.appendChild(createPlayerImage(player))
	div.appendChild(createPlayerName(player))
	div.appendChild(createTextbox(player))
	div.appendChild(createLoyaltySpace(player))
	return div
}

function createPlayerImage(player) {
	let div = document.createElement("div")
	div.classList.add("player-image")
	let img = document.createElement("img")
	img.src = player.baseData.images.player
	div.appendChild(img)
	return div
}

function createPlayerName(player) {
	let div = document.createElement("div")
	div.classList.add("player-name")
	let nameContainer = document.createElement("span")
	nameContainer.classList.add("cardText")
	nameContainer.innerText = player.baseData.name
	div.appendChild(nameContainer)
	return div
}

function createTextbox(player) {
	let div = document.createElement("div")
	div.classList.add("textbox")
	div.appendChild(setDatasetDiv("club", player))
	div.appendChild(setDatasetDiv("league", player))
	div.appendChild(setDatasetDiv("nation", player))
	return div
}

function setDatasetDiv(property, player) {
	let div = document.createElement("div") // ALL ABOUT DIVS
	div.classList.add("inline-text")
	div.dataset.property = property
	if (property === "nation") {
		div.innerHTML = nations[+player.baseData.nation] // nations[45] === Spain, for instance
	} else {
		div.innerHTML = player.baseData[property]
	}
	return div
}

function createLoyaltySpace(player) {
	let isActivated = false
	let div = document.createElement("div")
	div.classList.add("inline-text")
	div.classList.add("chemistry")
	div.appendChild(createLoyaltyToggler(player))
	div.appendChild(createLoyaltyCounter(player))
	return div
}

function createLoyaltyCounter(player) {
	let div = document.createElement("div")
	let span = document.createElement("span")
	span.classList.add("cardText")
	span.innerHTML = player.chemistry
	div.classList.add("player-chemistry")
	div.appendChild(span)
	return div
}

function createLoyaltyToggler(player) {
	let activated = false
	let button = document.createElement("button")
	button.innerHTML = "Toggle Loyalty"
	button.classList.add("loyalty")
	button.classList.add("cardText")
	button.onclick = function() {
		let chemistryCounter = this.nextElementSibling
		if (!activated) {
			player.chemistry = Math.min(10, getIndividualChemistry(player) + 1)
			activated = true
		} else {
			player.chemistry = Math.min(10, getIndividualChemistry(player) - 1)
			activated = false
		}
		refreshDOM(chemistryCounter, player.chemistry)
	}
	return button
}

function fillSidebar(div, player) {
	for (property of ["overall", "position", "club", "nation"]) {
		let subDiv = generateSidebarSubDiv(property, player)
		div.appendChild(subDiv)
	}
	return div
}

function rackSidebarImage(srcValue) {
	let img = document.createElement("img")
	img.src = srcValue
	return img
}

function generateSidebarSubDiv(property, player) {
	let div = document.createElement("div")
	div.classList.add("player-" + property)
	if (["nation", "club"].includes(property)) {
		let image = rackSidebarImage(player.baseData.images[property])
		div.appendChild(image)
	} else {
		let propertyValue = property === "position" ? player.baseData.position : player.ig_data[property]
		div.innerHTML = propertyValue
	}
	return div
}

function generateXButton(player) {
	let div = document.createElement("div")
	div.classList.add("x-button")
	let button = createXButton(player)
	div.appendChild(button)
	return div
}

function createXButton(player) {
	let button = document.createElement("button")
	button.onclick = function() {
		let ancestor = grandFather(button, 3)
		ancestor.removeChild(grandFather(button, 2))
		listHandler.removePlayer(player)
	}
	button.innerHTML = "X"
	return button
}

function getDivClass(edition, quality) {
	if (["RB", "FUTTIES", "SWAP", "SBC", "GREEN",
		"SCREAM", "FUTMAS", "MOTM", "EUMOTM", "POTM", "TOTGS",
		"TOTKS", "TOTY", "PTG", "PTGS", "HERO", "FUT-BIRTHDAY",
		"FOF", "OTW"].includes(edition)) {
		return edition.toLowerCase()
	} else if (edition === "NIF") {
		return "rare-" + quality // I currently do not plan on implementing any way to handle rare / non-rare cards.
	}
	return edition.toLowerCase() + "-" + quality
}

function bindIndividualChemistry(player) {
	player._chemistry = 0
	Object.defineProperty(player, "chemistry", {
		configurable: true,
		enumerable: false,
		get: function() {
			return this._chemistry
		},
		set: function(value) {
			this._chemistry = value
		}
	})
	// this is the key aspect of Vue and Angular: a "reactive" property
	// that is just a getter & setter
}
