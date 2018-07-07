const conditionsOptions = [
	"Number of Nations", "Number of Leagues", "Number of Clubs", "Number of Special Players",
	"Number of Normal Players", "Players of the same Nation", "Players of the same League",
	"Players of the same Club", "Team Chemistry"]

function appendToList(array, data) {
	array.push(data)
}

// convenient recursive method instead of chaining the .parentNode properties
function grandFather(thisArg, generation) {
	if (generation) {
		return grandFather(thisArg.parentNode, generation - 1)
	}
	return thisArg
}

function refreshDOM(dom, value) {
	dom.innerHTML = value
	dom.value = value
	// once we updated the value, make it show up on the html element
	// Vue.js cornerstone
}

function capitalize(string) {
	return string.replace(/\w/, firstLetter => firstLetter.toUpperCase())
}

function forceNumber(value, minmax) {
	if (Array.isArray(value)) {
		return Math[minmax].apply(null, value)
	}
	return Number(value)
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
