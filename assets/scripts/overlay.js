let conditionsOL = document.querySelector("ol.condition-generator")
// OLYMPIQUE LYONNAIS never mind
conditionsOL.onchange = function() {
	refreshConditions(this)
}

document.getElementsByClassName("submit")[0].onclick = function() {
	let valid = DOM_Validator.conditions.length >= 1
	if (valid) prepareField()
}

function generateConditionRow() {
	let input = generateInput()
	let conditionSelect = generateConditionLabel(input)
	let keywordSelect = generateKeywordDropdown()
	let removeCurrentRow = generateRowRemover()
	let bundledElements = [conditionSelect, keywordSelect, input, removeCurrentRow]

	return bundle.apply(null, bundledElements)
}

function generateInput() {
	let input = document.createElement("input")
	input.classList.add("condition-number")
	input.type = "number"
	input.min = 0
	input.step = 1
	input.id = "boundInput"
	input.style.width = "39px"
	return input
}

function generateConditionLabel(boundElement) {
	let select = document.createElement("select")
	select.classList.add("condition-label")
	fillSelect.apply(null, [select, ""].concat(conditionsOptions))
	bindSelect(select, boundElement)
	return select
}

function bindSelect(select, target) {
	select.onchange = function() {
		if (this.value === "Team Chemistry") {
			target.max = 100
		} else {
			target.max = 11
			if (target.value > 11) target.value = 11
		}
	}
}

function generateKeywordDropdown() {
	let select = document.createElement("select")
	select.classList.add("condition-keyword")
	fillSelect.apply(null, [select, ""].concat(["Min.", "Max.", "Exactly"]))
	return select
}

function generateRowRemover() {
	let button = document.createElement("button")
	button.innerHTML = "-"
	button.classList.add("rowRemover")
	button.onclick = function() {
		removeParentRow(button)
		refreshConditions(conditionsOL)
	}
	return button
}

function removeParentRow(target) {
	let conditionsOL = grandFather(target, 2)
	let parentLI = grandFather(target, 1)
	conditionsOL.removeChild(parentLI)	
}

function fillSelect() {
	let args = Array.from(arguments)
	let [select, ...selectOptions] = args
	for (value of selectOptions) {
		let option = document.createElement("option")
		option.innerHTML = value
		select.appendChild(option)
	}
}

function bundle() {
	let args = Array.from(arguments)
	let row = document.createElement("li")
	row.classList.add("condition-row")
	for (argument of args) {
		row.appendChild(argument)
	}

	return row
}

function createNewRow() {
	let createdRow = generateConditionRow()
	conditionsOL.appendChild(createdRow)
}

function collectCondition(rowLI) {
	let label = getConditionPart(rowLI, "condition-label")
	let keyword = getConditionPart(rowLI, "condition-keyword")
	let value = getConditionPart(rowLI, "condition-number")
	if ([label, keyword, value].includes("")) return
		// One needed term is empty, condition is invalid
	return { label, keyword, value: +value }
}

for (i = 0; i < 5; i++) {
	createNewRow()
}

function getConditionPart(parent, className) {
	return parent.getElementsByClassName(className)[0].value
}

function refreshConditions(OL) {
	let separatedConditions = OL.getElementsByClassName("condition-row")
	let synthetizedText = ""
	let i = 0
	for (conditionRow of separatedConditions) {
		let collectedCondition = collectCondition(conditionRow)
		if (collectedCondition) {
			DOM_Validator.controlCondition(collectedCondition, i)
			i++
		}
	}

	for (let validCondition of DOM_Validator.conditions) {
		synthetizedText += stringify(validCondition) + "\n"
	}
	// DOM_Validator.conditions gets updated if the condition can be reached

	refreshDOM(document.getElementsByClassName("conditions-textarea")[0], synthetizedText)
}
