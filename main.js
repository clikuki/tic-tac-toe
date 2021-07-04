const gridEl = document.querySelectorAll('#grid > .gridSpace');
const winDisplay = document.querySelector('#winDisplay');
const newGameBtn = document.querySelector('#newGame');

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
		if(markerType > 1 || markerType < 0) return;
		if(pos > gridMarksArray.length - 1 || pos < 0) return;
		if(gridMarksArray[pos] !== null) return;

		gridMarksArray[pos] = markerType;
		updateGrid();
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
	let currPlayer = 1;
	let winStateReached = false;

	const gridListeners = (() =>
	{
		function addMark(e)
		{
			if(e.target.textContent !== '') return;

			const elIndex = Array.prototype.indexOf.call(gridEl, e.target);

			grid.placeAt(currPlayer, elIndex);

			if(!currPlayer) currPlayer = 1;
			else currPlayer = 0;
		}

		function displayWinMessage()
		{
			const winner = getWinner();

			// return if there is no winner
			if(winner === null) return;

			winStateReached = true;

			const winMessage = winner ? 'player 1 has won' : 'player 2 has won';

			winDisplay.textContent = winMessage;
		}

		function gridSpaceCallBack(e)
		{
			if(winStateReached) return;

			addMark(e);
			displayWinMessage();
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

// function checkColumns()
// {
// 	console.log(getColumns());
// }

// function checkRows()
// {
// 	const rowsArray = getRows();

// 	for(const row of rowsArray)
// 	{
// 		const currMarker = row[0];

// 		if(currMarker !== null)
// 		{
// 			if(row.every((val) => val === currMarker))
// 			{
// 				return currMarker;
// 			}
// 		}
// 	}

// 	// if loop has been exited, then no rows are equal
// 	return false;
// }

// checkColumns();
// const winner = checkRows();
// if(winner !== false && winDisplay.textContent === '')
// {
// 	if(winner)
// 	{
// 		winDisplay.textContent = 'player 1 has won!';
// 	}
// 	else
// 	{
// 		winDisplay.textContent = 'player 2 has won!';
// 	}
// }
