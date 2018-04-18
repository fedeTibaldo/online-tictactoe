module.exports = (function() {
	let waitingPlayer = null
	let matches = {}

	const match = {
		addPlayer: function(p) {
			if (this.players.length < 2)
				if (!~this.players.indexOf(p))
					this.players.push(p)
		},
		isFull: function() {
			return this.players.length === 2
		},
		init: function(p1, p2) {
			this.players = [p1, p2]
		}
	}
	
	function createMatch(p1, p2) { 
		let roomId = `${p1.id}${p2.id}`
		matches[roomId] = Object.create(match)
		matches[roomId].init(p1, p2)
		return roomId
	}

	function findMatch(p) {
		if (!waitingPlayer)
			waitingPlayer = p
		else {
			let roomId = createMatch(waitingPlayer, p)
			waitingPlayer = null
			return roomId
		}
	}

	function getMatch(id) {
		return matches[id]
	}
	
	return {
		findMatch: findMatch,
		getMatch: getMatch,
	}
})()