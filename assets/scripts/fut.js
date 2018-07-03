/*
All FUT-related operations should go here
Includes:
	* Chemistry Calculation (Individual)
	* Chemistry Calculation (Team) : DONE (easy)
	* Determining which color a pedestal should show depending
	* on the player position : DONE
	* Calculating Team Rating : DONE
	* Coloring chemistry links between each player
*/

function getTeamChemistry(players) {
	/*let chemistryValues = Array.prototype.map.call(players, player => {
		return +player.querySelector(".player-chemistry span").innerText
	}).reduce((sum, singleValue) => sum + singleValue, 0)

	return Math.min(100, chemistryValues)*/
	return 100
}

function getTeamRating(players) {
	let totalSquadCount = 11 // there are 11 players in a pitch, come on!
	let ratings = Array.prototype.map.call(players, player =>
		+player.getElementsByClassName("player-ovr")[0].innerText)

	let avg = ratings.reduce((count, rating) => count + rating, 0) / totalSquadCount

	let higherRatingsTotal = ratings
			.filter(rating => rating > avg)
			.reduce((difference, rating) => difference + (rating - avg), 0)

	if (higherRatingsTotal) {
		let rateAboveAvg = higherRatingsTotal / totalSquadCount
		avg = Math.floor(avg + rateAboveAvg)
	}

	return avg
}

function getPositionChemistry(currentPosition, actualPosition) {
	if (currentPosition === actualPosition) return 3
	return {
		GK: {},
		RB: {CB: 1,LB: 1,RWB: 2,RM: 1},
		CB: {RB: 1,LB: 1,CDM: 1},
		LB: {CB: 1,RB: 1,LWB: 2,LM: 1,LW: 1},
		RWB: {RB: 2,LWB: 1,RM: 1,RW: 1},
		LWB: {LB: 2,RWB: 1,LM: 1},
		CDM: {CB: 1,CM: 2,CAM: 1},
		CM: {CDM: 2,CAM: 2,RM: 1,LM: 1},
		CAM: {CDM: 1,CM: 2,CF: 2},
		RM: {RB: 1,RWB: 1,CM: 1,LM: 1,RW: 2,RF: 1},
		LM: {LB: 1,LWB: 1,CM: 1,RM: 1,LW: 2,LF: 1},
		RW: {RWB: 1,RM: 2,LW: 1,RF: 2},
		LW: {LB: 1,LM: 2,RW: 1,LF: 2},
		CF: {CAM: 2,RF: 1,LF: 1,ST: 2},
		RF: {RM: 1,RW: 2,CF: 1,LF: 1,ST: 1},
		LF: {LM: 1,LW: 2,CF: 1,RF: 1,ST: 1},
		ST: {CF: 2,RF: 1,LF: 1}
	}[actualPosition][currentPosition] || 0
}

function getPedestalTextColor(currentPosition, actualPosition) {
	switch (getPositionChemistry(currentPosition, actualPosition)) {
		case 3:
			return "#22d716"
			break
		case 2:
		case 1:
			return "#ffc200"
			break
		case 0:
			return "#ff3731"
	}
}

function getIndividualChemistry() {
	return 5
}
