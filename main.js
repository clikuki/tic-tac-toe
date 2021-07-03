const gridEl = document.querySelectorAll('#grid > .gridSpace');
const winDisplay = document.querySelector('#winDisplay');
const newGameBtn = document.querySelector('#newGame');

const grid = (() =>
{
	// private

	const gridMarksArray = (() =>
	{
		const arr = [];

		for(let i = 0; i < gridEl.length; i++)
		{
			arr.push(null);
		}

		return arr;
	})();

	function updateGrid()
	{
		for(const [i, gridSpace] of Object.entries(gridEl))
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

		for(let i = 0; i < gridEl.length; i++)
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
})();

(function ()
{
	let currPlayer = 1;

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

		function checkIfWin()
		{
			const gridMarks = grid.getGrid();

			function checkRows()
			{
				const rowsArray = [];

				for(let i = 0; i < gridMarks.length; i += 3)
				{
					rowsArray.push(gridMarks.slice(i, i + 3));
				}

				for(const row of rowsArray)
				{
					const currMarker = row[0];

					if(currMarker !== null)
					{
						if(row.every((val) => val === currMarker))
						{
							return currMarker;
						}
					}
				}

				// if loop has been exited, then no rows are equal
				return false;
			}

			const winner = checkRows();
			if(winner !== false && winDisplay.textContent === '')
			{
				if(winner)
				{
					winDisplay.textContent = 'player 1 has won!';
				}
				else
				{
					winDisplay.textContent = 'player 2 has won!';
				}
			}
		}

		function callbackCollection(e)
		{
			addMark(e);
			checkIfWin();
		}

		return () =>
		{
			for(const gridSpace of gridEl)
			{
				gridSpace.addEventListener('click', callbackCollection);
			}
		};
	})();

	const newGameListener = (() =>
	{
		function newGameEvent()
		{
			grid.clear();
			currPlayer = 1;
			winDisplay.textContent = '';
		}

		return () => newGameBtn.addEventListener('click', newGameEvent);
	})();

	gridListeners();
	newGameListener();
})();
