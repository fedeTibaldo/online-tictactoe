var tictactoe = tictactoe || (function() {
	var turn = 1
	var _winStrokeContainer
	var _announcementContainer
	var _boxes = []
	var gameBoard = []
  /**
   * Displays an X in the given element
   */
	function printX(el) {
		el.innerHTML = '<svg viewBox="0 0 7 7" version="1.1" xmlns="http://www.w3.org/2000/svg"><g class="x-group"><line class="x dash" x1="2" y1="2" x2="5" y2="5"/><line class="x dash-delay" x1="2" y1="5" x2="5" y2="2"/></g></svg>'
	}
  /**
   * Displays an O in the given element
   */
	function printO(el) {
		el.innerHTML = '<svg viewBox="0 0 7 7" version="1.1" xmlns="http://www.w3.org/2000/svg"><g class="o-group"><circle class="o dash-long" cx="3.5" cy="3.5" r="2"/></g></svg>'
	}
	
	function announce(msg) {
		let el = _announcementContainer
		let container = document.createElement('div')
		container.classList.add('container-sm', 'text-center')
		let p = document.createElement('p')
		p.textContent = msg
		let btn = document.createElement('a')
		btn.classList.add('button')
		btn.href = '/'
		btn.title = 'Exit'
		btn.textContent = 'Exit to title'
		container.appendChild(p)
		container.appendChild(btn)
		el.appendChild(container)
		el.classList.toggle('visible')
	}
	
	function strokeRow(index) {
		let y = 3.25 * (index + 1) + 2 * index
		let color = getTurn()
		_winStrokeContainer.innerHTML = `<svg viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg"><line class="win-stroke ${color} dash-delay-long" x1="1" y1="${y}" x2="16" y2="${y}"/></svg>`
	}
	
	function strokeColumn(index) {
		let x = 3.25 * (index + 1) + 2 * index
		let color = getTurn()
		_winStrokeContainer.innerHTML = `<svg viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg"><g class="win-stroke"><line class="${color} dash-delay-long" x1="${x}" y1="1" x2="${x}" y2="16"/></g></svg>`
	}
	
	function strokeDiagonal(index) {
		let f = (x) => (x - 8.5) * index + 8.5
		let color = getTurn()
		_winStrokeContainer.innerHTML = `<svg viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg"><g class="win-stroke-diagonal"><line class="${color} dash-delay-long" x1="1" y1="${f(1)}" x2="16" y2="${f(16)}"/></g></svg>`
	}
  
	function changeTurn() {
		turn ^= 1
	}
	function getTurn() {
		return turn ? 'x' : 'o'
	}
	function update(index) {
		if (legal(index)) {
			gameBoard[index] = getTurn()
			let el = _boxes[index]
			if (getTurn() === 'x')
				printX(el)
			else
				printO(el)
				
			if (win())
				announce(getTurn() + ' won!')
			else if (tie())
				announce('Oh snap! It\'s a tie')
			else
				changeTurn()
		}
	}
  function legal(index) {
  	if (typeof gameBoard[index] !== 'undefined')
    	return false
    return true
  }
	function win() {
		// check rows
		for (let i = 0; i < 3; i++)
			if (gameBoard[i*3 + 0] === gameBoard[i*3 + 1] && 
					gameBoard[i*3 + 1] === gameBoard[i*3 + 2] &&
					typeof gameBoard[i*3 + 1] !== 'undefined') {
				strokeRow(i)
				return true
			}
		// check columns
		for (let i = 0; i < 3; i++)
			if (gameBoard[i + 0*3] === gameBoard[i + 1*3] &&
					gameBoard[i + 1*3] === gameBoard[i + 2*3] &&
					typeof gameBoard[i + 1*3] !== 'undefined') {
				strokeColumn(i)
				return true
			}
				
		// check diagonals
		if (gameBoard[0] === gameBoard[4] &&
				gameBoard[4] === gameBoard[8] &&
				typeof gameBoard[4] !== 'undefined') {
			strokeDiagonal(1)
			return true
		}
		if (gameBoard[2] === gameBoard[4] &&
				gameBoard[4] === gameBoard[6] &&
				typeof gameBoard[4] !== 'undefined') {
			strokeDiagonal(-1)
			return true
		}
	}
	function tie() {
		for (let i = 0; i < 9; i++)
			if (typeof gameBoard[i] === 'undefined')
				return false
		return true
	}
	function init(boxes, winStrokeContainer, announcementContainer) {
		_boxes = Array.from(boxes)
		_boxes.forEach( (el, index) => {
			el.addEventListener('click', function(e) {
				update(index)
			})
		})
		_winStrokeContainer = winStrokeContainer
		_announcementContainer = announcementContainer
	}
	return {
		init: init,
		update: update
	}
})()