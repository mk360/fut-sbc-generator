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

	for (label of modifiedConditionsOptions) {
		caps[label] = {
			min: 0,
			max: 11
		}
	}

	return {
		appendCondition: function(condition) {
			chosenConditions.push(condition)
		},
		controlCondition: function(condition) {
			let chosenLabel = condition[0]
			let boundaries = caps[chosenLabel]
			let conditionIsLegit = checkLegitimacy(boundaries, condition)
			if (conditionIsLegit) {
				applyNewBoundaries(caps, chosenLabel, condition)
				return true
			}
		},
		get conditions() {
			return chosenConditions
		}
	}
})()

function applyNewBoundaries(caps, label, condition) {
	
}

function checkLegitimacy(boundaries, condition) {
	let [, keyword, wantedValue] = condition // Destructuring is love, destructuring is life
	let legitimacyFunction = getKeywordFunction(keyword)
	let partialApplication = legitimacyFunction.bind(null, wantedValue)
	// we decided what value we want to compare,
	// we still need to decide what should be the threshold

	let threshold = getThreshold(keyword, wantedValue, boundaries)
	if (threshold) return partialApplication(+threshold)
}

function extractThreshold(keyword, wantedValue, boundaries) {
	return {
		"Min.": boundaries.min,
		"Max.": boundaries.max,
		"Exactly": wantedValue
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

function getThreshold(keyword, wantedValue, boundaries) {
	if (thresholdIsValid(keyword, wantedValue, boundaries)) {
		let threshold = extractThreshold(keyword, wantedValue, boundaries)
		if (threshold >= 0) return threshold.toString()
		// 0 is a valid threshold sometimes, so we
		// force "0" to be a truthy value
	}
}

function isVerified(condition) {
	let {
		label,
		keyword,
		requiredValue
	} = condition

	return parseCondition(label, keyword, requiredValue)
}

function parseCondition(label, keyword, requiredValue) {
	let testedValue = getCheckedValue(label)
	let comparingFunction = getKeywordFunction(keyword)
	return comparingFunction(testedValue, requiredValue)
}

function thresholdIsValid(keyword, wantedValue, boundaries) {
	return {
		"Max.": wantedValue <= boundaries.max,
		"Min.": wantedValue >= boundaries.min,
		"Exactly": wantedValue >= boundaries.min && wantedValue <= boundaries.max
	}[keyword]
}

function validateConditions() {

}
