// Here lie all the junk functions that have no use in this file; they only assist other functions in their jobs

const conditionsOptions = [
	"Number of Nations", "Number of Leagues", "Number of Clubs", "Number of Special Players",
	"Number of Normal Players", "Players of the same Nation", "Players of the same League",
	"Players of the same Club", "Team Chemistry"]

function appendToList(array, data) {
	array.push(data)
}

function capitalize(string) {
	return string.replace(/\w/, firstLetter => firstLetter.toUpperCase())
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

function decrementEntries(componentsList, neededData) {
	componentsList.nations[neededData.nation]--
	componentsList.clubs[neededData.club]--
	componentsList.leagues[neededData.league]--
	componentsList.qualities[neededData.quality]--
	componentsList.editions[neededData.edition]--
	componentsList.specialness[neededData.isSpecial.toString()]--
}

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

function forceNumber(value, minmax) {
	if (Array.isArray(value)) {
		return Math[minmax].apply(null, value)
	}
	return Number(value)
}

// convenient recursive method instead of chaining the .parentNode properties
function grandFather(thisArg, generation) {
	if (generation) {
		return grandFather(thisArg.parentNode, generation - 1)
	}
	return thisArg
}

function incrementEntries(componentsList, neededData) {
	componentsList.nations[neededData.nation]++
	componentsList.clubs[neededData.club]++
	componentsList.leagues[neededData.league]++
	componentsList.qualities[neededData.quality]++
	componentsList.editions[neededData.edition]++
	componentsList.specialness[neededData.isSpecial.toString()]++
}

function refreshDOM(dom, value) {
	dom.innerHTML = value
	dom.value = value
	// once we updated the value, make it show up on the html element
	// Vue.js cornerstone
}

function removeFromArray(array, element) { 
	let i = 0
	for (let loopedElement of array) {
		if (_.isEqual(loopedElement, element)) {
			array.splice(i, 1)
			return 
		}
		i++
	}
}

function stringify(condition) {
		return condition.label + ": " + condition.keyword + " " + condition.value
}

const fieldUpdate = new Event("fieldUpdate")
