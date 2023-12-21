enum Dir {
	WEST,
	NORTH,
	EAST,
	SOUTH,
}


function getOppositeDir(dir: Dir): Dir {
	switch (dir) {
		case Dir.WEST:
			return Dir.EAST
		case Dir.EAST:
			return Dir.WEST
		case Dir.NORTH:
			return Dir.SOUTH
		case Dir.SOUTH:
			return Dir.NORTH
	}
}

function getCoordOffsetFromDir(dir: Dir): Pos {
	switch (dir) {
		case Dir.WEST:
			return { x: -1, y: 0 }
		case Dir.EAST:
			return { x: 1, y: 0 }
		case Dir.NORTH:
			return { x: 0, y: -1 }
		case Dir.SOUTH:
			return { x: 0, y: 1 }
	}
}

type Pos = {
	x: number
	y: number
}

type Loc = {
	pos: Pos
	from: Dir
	to: Dir
}

type LinkedList = {
	head: Loc
	size: number
	add: (pipe: Loc) => void
	getFirst: () => Loc
	getLast: () => Loc
}



function getCoordFromDir(pos: Pos, dir: Dir): Pos {
	const { x, y } = getCoordOffsetFromDir(dir)
	return { x: pos.x + x, y: pos.y + y }
}


export {
	Dir,
	Loc,
	Pos,
	LinkedList,
	getCoordFromDir,
	getCoordOffsetFromDir,
	getOppositeDir
}
