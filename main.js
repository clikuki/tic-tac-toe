const gridEl = document.querySelectorAll('#grid > .gridSpace');

const grid = ((gridElement) =>
{
	// private

	const gridMarksArray = (() =>
	{
		const arr = [];

		for(let i = 0; i < gridElement.length; i++)
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
		gridMarksArray.length = 0;

		for(let i = 0; i < gridElement.length; i++)
		{
			gridMarksArray.push(null);
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

	const getGrid = () => gridMarksArray;

	return {
		clear,
		placeAt,
		getGrid,
	};
})(gridEl);

(() =>
{
	const newGameBtn = document.querySelector('#newGame');
	const counterDiv = document.querySelector('#counterDiv');
	const winDisplay = counterDiv.querySelector('#winDisplay');

	let currPlayer = 1;
	let winStateReached = false;

	const gridListeners = (() =>
	{
		function addMark(e)
		{
			const gridSpace = e.target;
			const gridIndex = Array.prototype.indexOf.call(gridEl, gridSpace);
			const returnMessage = grid.placeAt(currPlayer, gridIndex);

			if(returnMessage !== 1) return;

			if(!currPlayer) currPlayer = 1;
			else currPlayer = 0;
		}

		function displayWinMessage(winner)
		{
			const winMessage = winner ? 'player 1 has won' : 'player 2 has won';

			winStateReached = true;
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

				updateCounterDisplay(scoreObj);
				displayWinMessage(winner);
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
	newGameListener();
})();

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

	// checks if arrays have only one type of element ie. [1,1,1] but not [1,2,3];
	function ifSameElements(...array)
	{
		for(const subArray of array)
		{
			const hasNull = ifArrayHasNull(subArray);

			if(!hasNull)
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

	function ifArrayHasNull(array)
	{
		return array.some((el) => el === null);
	}

	const threesArray = [...getRows(), ...getColumns(), ...getDiagonals()];

	return ifSameElements(...threesArray);
}
