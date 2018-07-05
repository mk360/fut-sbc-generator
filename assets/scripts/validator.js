// When in condition-defining mode,
// control the legitimacy of conditions.
// When in problem-solving mode, control the validation
// of the user's choices

const solvingValidator = (function() {
	return {
		verify: function() {
			let args = Array.prototype.slice.call(arguments)
			for (condition of args) {
				if (!isVerified(condition)) {
					return false
				}
			}
			return true
		}
	}
})()

const DOM_Validator = (function() {
	let chosenConditions = []
	let caps = {
		"Team Chemistry": {
			min: 0,
			max: 100
		}
	}

	let modifiedConditionsOptions = [...conditionsOptions]
	modifiedConditionsOptions.pop()

	for (let label of modifiedConditionsOptions) {
		caps[label] = {
			min: 0,
			max: 11
		}
	}

	return {
		controlCondition: function(condition, index) {
			let chosenLabel = condition.label
			let boundaries = caps[chosenLabel]
			let conditionIsLegit = checkLegitimacy(boundaries, condition)
			if (conditionIsLegit) {
				DOM_Validator.conditions[index] = condition
				applyNewBoundaries(boundaries, condition, chosenLabel)
				console.log(boundaries)
				return true
			}
		},
		get conditions() {
			return chosenConditions
		}
	}
})()

function applyNewBoundaries(boundaries, condition, chosenLabel) {
	let newBoundary = extractThreshold(condition.keyword, condition.label, boundaries).text
	setBoundaries(boundaries, newBoundary, condition)
}

function checkLegitimacy(boundaries, condition) {
	let {keyword, value} = condition // Destructuring is love, destructuring is life
	let legitimacyFunction = getKeywordFunction(keyword)
	let partialApplication = legitimacyFunction.bind(null, value)
	// we decided what value we want to compare,
	// we still need to decide what should be the threshold

	let threshold = getThreshold(keyword, value, boundaries)

	if (threshold >= 0) return partialApplication(+threshold)
}

function extractThreshold(keyword, value, boundaries) {
	return {
		"Min.": { bound: boundaries.min, text: "min" },
		"Max.": { bound: boundaries.max, text: "max" },
		"Exactly": { bound: value }
	}[keyword]
}

function getCheckedValue(label) {
	return {
			"Number of Nations": getCount("nations"),
			"Number of Leagues": getCount("leagues"),
			"Number of Clubs": getCount("clubs"),
			"Number of Special Players": getListedComponent("specialness")["true"],
			"Number of Normal Players": getListedComponent("specialness")["false"],
			"Players of the same Nation": getSame("nations"),
			"Players of the same League": getSame("leagues"),
			"Players of the same Club": getSame("clubs"),
			"Team Chemistry": listHandler.teamChemistry
	}[label]
}

function getCount(wantedProperty) {
	return getListedComponent(wantedProperty).count
}

function getListedComponent(wantedProperty) {
	return listHandler.componentsList[wantedProperty]
}

function getKeywordFunction(keyword) {
	return {
		"Max.": function(value, threshold) {
			return forceNumber(value, "max") <= threshold
		},
		"Min.": function(value, threshold) {
			return forceNumber(value, "min") >= threshold
		},
		"Exactly": function(value, threshold) {
			return forceNumber(value) === threshold
		}
	}[keyword]
}

function getSame(property) {
	let propertyList = getListedComponent(property)
	let valuesList = Object.keys(propertyList).map(property => propertyList[property])
	return valuesList
}

function getThreshold(keyword, value, boundaries) {
	if (thresholdIsValid(keyword, value, boundaries)) {
		let threshold = extractThreshold(keyword, value, boundaries).bound
		if (threshold >= 0) return +(threshold.toString())
		// 0 is a valid threshold sometimes, so we
		// force "0" to be a truthy value
	}
}

function isVerified(condition) {
	let {
		label,
		keyword,
		value
	} = condition

	return parseCondition(label, keyword, value)
}

function parseCondition(label, keyword, value) {
	let testedValue = getCheckedValue(label)
	let comparingFunction = getKeywordFunction(keyword)
	return comparingFunction(testedValue, value)
}

function setBoundaries(boundaries, newBoundary, condition) {
	if (["max", "min"].includes(newBoundary)) {
		boundaries[newBoundary] = condition.value
	} else {
		boundaries.max = boundaries.min = condition.value
	}
}

function thresholdIsValid(keyword, value, boundaries) {
	return value <= boundaries.max && value >= boundaries.min
}

function validateConditions() {

}
