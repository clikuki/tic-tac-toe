const gridEl = document.querySelectorAll('#grid > .gridSpace');
const newGameBtn = document.querySelector('#newGame');

const grid = (function ()
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

const setEventListeners = (function ()
{
	const gridListeners = (() =>
	{
		let currPlayer = 1;

		const addMarkCallBack = (e) =>
		{
			if(e.target.textContent !== '') return;

			const elIndex = Array.prototype.indexOf.call(gridEl, e.target);

			grid.placeAt(currPlayer, elIndex);

			if(!currPlayer) currPlayer = 1;
			else currPlayer = 0;
		};

		return () =>
		{
			for(const gridSpace of gridEl)
			{
				gridSpace.addEventListener('click', addMarkCallBack);
			}
		};
	})();

	const newGameListener = () =>
	{
		newGameBtn.addEventListener('click', grid.clear);
	};

	return () =>
	{
		gridListeners();
		newGameListener();
	};
})();

function initialize()
{
	setEventListeners();
}

initialize();
