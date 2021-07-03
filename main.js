const gridSpaces = document.querySelectorAll('#grid > .gridSpace');

const grid = (function ()
{
	const gridSpaceArray = [null, null, null, null, null, null, null, null, null];

	const clearGridArray = () =>
	{
		gridSpaceArray.length = 0;

		for(let i = 0; i < gridSpaces.length; i++)
		{
			gridSpaceArray.push(null);
		}
	};

	const placeAt = (markerType, pos) =>
	{
		if(markerType > 1 || markerType < 0) return;

		gridSpaceArray[pos] = markerType;
	};

	// '✕' : '◯'

	const getGridArray = () => gridSpaceArray;

	return {
		clearGridArray,
		placeAt,
		getGridArray,
	};
})();

function setEventListeners()
{
	for(const gridSpace of gridSpaces)
	{
		gridSpace.addEventListener('click', (e) =>
		{
			const elIndex = Array.prototype.indexOf.call(gridSpaces, e.target);

			grid.placeAt(1, elIndex);
		});
	}
}

function initialize()
{
	setEventListeners();
}

initialize();
