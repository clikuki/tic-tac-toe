const gridEl = document.querySelectorAll('#grid > .gridSpace');

// grid manipulator, controls both the DOM grid and array grid
const grid = ((gridElement) =>
{
	// private

	// an iife to create an array of length 9 containing null
	const gridMarksArray = (() =>
	{
		const arr = [];

		for(let i = 0; i < 9; i++)
		{
			arr.push(null);
		}

		return arr;
	})();

	function updateGrid()
	{
		for(const [i, gridSpace] of Object.entries(gridElement))
		{
			if(gridMarksArray[i] === null)
			{
				gridSpace.textContent = '';
			}
			else
			{
				const marker = gridMarksArray[i] ? '✕' : '◯';

				gridSpace.textContent = marker;
			}
		}
	}

	// public

	function clear()
	{
		for(let i = 0; i < gridElement.length; i++)
		{
			gridMarksArray[i] = null;
		}

		updateGrid();
	}

	function placeAt(markerType, pos)
	{
		if(markerType > 1 || markerType < 0) return 0;
		if(pos > gridMarksArray.length - 1 || pos < 0) return 0;
		if(gridMarksArray[pos] !== null) return 0;

		gridMarksArray[pos] = markerType;
		updateGrid();

		return 1;
	}

	// returns the board array
	const getGrid = () => gridMarksArray;

	return {
		clear,
		placeAt,
		getGrid,
	};
})(gridEl);

// contains addeventlisteners and function associated with the events
(() =>
{
	const newGameBtn = document.querySelector('#newGame');
	const counterDiv = document.querySelector('#counterDiv');
	const winDisplay = counterDiv.querySelector('#winDisplay');

	// 1 === X, 0 === O
	let currPlayer = 1;
	let winStateReached = false;

	// callback for grid spaces, also contains functions for grid
	const gridListeners = (() =>
	{
		// adds a mark to the board
		function addMark(e)
		{
			const gridSpace = e.target;
			const gridIndex = Array.prototype.indexOf.call(gridEl, gridSpace);
			const returnMessage = grid.placeAt(currPlayer, gridIndex);

			if(returnMessage !== 1) return;

			if(!currPlayer) currPlayer = 1;
			else currPlayer = 0;
		}

		function displayMessage(winMessage)
		{
			winDisplay.textContent = winMessage;
		}

		function updateCounterDisplay(playerScores)
		{
			const [counter1, counter2] = counterDiv.querySelectorAll('.playerCounter .score');

			counter1.textContent = playerScores.player1;
			counter2.textContent = playerScores.player2;
		}

		const addToCounter = (() =>
		{
			const playerScores = {
				player1: 0,
				player2: 0,
			};

			return (winner) =>
			{
				if(winner)
				{
					playerScores.player1 += 1;
				}
				else
				{
					playerScores.player2 += 1;
				}

				return playerScores;
			};
		})();

		function gridSpaceCallBack(e)
		{
			if(winStateReached) return;

			addMark(e);

			const winner = getWinner();
			if(winner !== null)
			{
				const scoreObj = addToCounter(winner);
				const winMessage = winner ? 'player 1 has won' : 'player 2 has won';

				winStateReached = true;
				updateCounterDisplay(scoreObj);
				displayMessage(winMessage);
			}
			else if(gameIsTied())
			{
				displayMessage('Game is tied!');
			}
		}

		return () =>
		{ // returns loop to add event listener to all grid spaces
			for(const gridSpace of gridEl)
			{
				gridSpace.addEventListener('click', gridSpaceCallBack);
			}
		};
	})();

	// allow players to change their name
	const changeNameListener = (() =>
	{
		const nameDisplays = counterDiv.querySelectorAll('.playerCounter .name');
		const nameInputTemplate = document.querySelector('#nameInputTemplate > .name');
		const nameDisplayTemplate = document.querySelector('#nameDisplayTemplate > .name');

		function replaceWithInput(eventA)
		{
			const nameInput = nameInputTemplate.cloneNode(true);

			nameInput.firstChild.value = eventA.target.textContent;
			nameInput.addEventListener('keydown', setName);

			eventA.target.replaceWith(nameInput);
			nameInput.firstChild.focus();
		}

		function setName(eventB)
		{
			if(eventB.key === 'Enter' && eventB.target.value !== '')
			{
				const nameDisplay = nameDisplayTemplate.cloneNode();
				nameDisplay.textContent = eventB.target.value;
				nameDisplay.addEventListener('click', replaceWithInput);

				eventB.target.replaceWith(nameDisplay);
			}
		}

		return () =>
		{
			for(const nameEl of nameDisplays)
			{
				nameEl.addEventListener('click', replaceWithInput);
			}
		};
	})();

	// callback for new game btn, contains func to reset game
	const newGameListener = (() =>
	{
		function resetGame()
		{
			grid.clear();

			currPlayer = 1;
			winStateReached = false;
			winDisplay.textContent = '';
		}

		return () => newGameBtn.addEventListener('click', resetGame);
	})();

	gridListeners();
	changeNameListener();
	newGameListener();
})();

function gameIsTied()
{
	const gridMarks = grid.getGrid();

	if(gridMarks.every((el) => el !== null))
	{
		return true;
	}

	return false;
}

// checks if a win has been reached
// returns the winner if game has been won
// else, it returns null
function getWinner()
{
	const gridMarks = grid.getGrid();

	function getRows()
	{
		const rowsArray = [];

		const chunk = 3;
		for(let i = 0; i < gridMarks.length; i += chunk)
		{
			rowsArray.push(gridMarks.slice(i, i + chunk));
		}

		return rowsArray;
	}

	function getColumns()
	{
		const rowsArray = getRows();
		const columnArray = [];

		for(let i = 0; i < rowsArray.length; i++)
		{
			const column = [];

			rowsArray.forEach((row) => column.push(row[i]));

			columnArray.push(column);
		}

		return columnArray;
	}

	function getDiagonals()
	{
		const rowsArray = getRows();
		const leftDiagonal = [];
		const rightDiagonal = [];

		for(let j = 0; j < rowsArray.length; j++)
		{
			leftDiagonal.push(rowsArray[j][(rowsArray.length - 1) - j]);
			rightDiagonal.push(rowsArray[j][j]);
		}

		return [leftDiagonal, rightDiagonal];
	}

	// checks if arrays have only one type of element, [1,1,1] but not [1,2,3];
	// also returns if arrays have null even if it is the only array, so no [null, null, null]
	function ifSameElements(...array)
	{
		for(const subArray of array)
		{
			if(!arrayHasNull(subArray))
			{
				const [firstEl] = subArray;

				if(subArray.every((el) => el === firstEl))
				{ // if all elements equal the first element, then return first element as winner
					return firstEl;
				}
			}
		}

		// if loop has been exited, then no arrays passed
		return null;
	}

	function arrayHasNull(array)
	{
		return array.some((el) => el === null);
	}

	const threesArray = [...getRows(), ...getColumns(), ...getDiagonals()];

	return ifSameElements(...threesArray);
}
