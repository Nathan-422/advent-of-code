import { readFileSync } from 'node:fs'
import { Dir, Pos, getCoordFromDir, getOppositeDir } from '../grid-traversal.js'

enum Floor {
	'.',
	'/',
	'\\',
	'-',
	'|',
}

type FloorMap = {
	contents: twoDArr
	at: (map: twoDArr, pos: Pos) => Floor | Wall
}

type TreeNode = {
	children: Array<TreeNode>
	contents: BeamSeg
}

type twoDArr = string[][]

type Wall = null

type BeamSeg = {
	pos: Pos
	contents: Floor | Wall
	from: Dir
	to: Array<Dir> | null
}

function getContentsFromPos(map: twoDArr, pos: Pos): Floor | Wall {
	const { x, y } = { ...pos }
	const width = map[0].length
	const height = map.length

	if (
		x + 1 > width ||
		y + 1 > height ||
		x < 0 ||
		y < 0
	) {
		return null
	}

	const floor = map[y][x]
	let symbol: Floor
	switch (floor) {
		case '.':
			symbol = Floor['.']
			break
		case '/':
			symbol = Floor['/']
			break
		case '\\':
			symbol = Floor['\\']
			break
		case '-':
			symbol = Floor['-']
			break
		case '|':
			symbol = Floor['|']
			break
	}

	return symbol
}

function followBeamPaths(map: FloorMap, beam: BeamSeg, energizedTiles: Map<string, Pos>): TreeNode[] {
	if (beam.contents === null) {
		return [{
			contents: beam,
			children: new Array()
		}]
	}

	const newChildren = new Array<BeamSeg>()
	for (let dir of beam.to) {
		const nextPos = getCoordFromDir(beam.pos, dir)
		const nextContent = map.at(map.contents, nextPos)
		const nextSeg: BeamSeg = {
			pos: nextPos,
			from: getOppositeDir(dir),
			// TODO: the to: field should be based off where it's comming from?
			to: getBeamDirectionFromDir(nextContent, getOppositeDir(dir)),
			contents: nextContent
		}
		newChildren.push(nextSeg)
	}

	return newChildren.map(segment => {
		const key = '' + segment.from + '-' + segment.pos.x + '-' + segment.pos.y

		if (energizedTiles.has(key)) {
			return {
				contents: segment,
				children: new Array()
			}
		}

		energizedTiles.set(key, segment.pos)

		return {
			contents: segment,
			children: followBeamPaths(map, segment, energizedTiles)
		}
	})
}

function getBeamDirectionFromDir(floor: Floor, from: Dir): Array<Dir> {

	switch (floor) {
		case Floor['.']:
			return [getOppositeDir(from)]
		case Floor['/']:
			switch (from) {
				case Dir.EAST:
					return [Dir.SOUTH]
				case Dir.SOUTH:
					return [Dir.EAST]
				case Dir.WEST:
					return [Dir.NORTH]
				case Dir.NORTH:
					return [Dir.WEST]
			}
		case Floor['\\']:
			switch (from) {
				case Dir.EAST:
					return [Dir.NORTH]
				case Dir.SOUTH:
					return [Dir.WEST]
				case Dir.WEST:
					return [Dir.SOUTH]
				case Dir.NORTH:
					return [Dir.EAST]
			}
		case Floor['-']:
			if (from === Dir.NORTH || from === Dir.SOUTH) {
				return [Dir.EAST, Dir.WEST]
			}
			return [getOppositeDir(from)]
		case Floor['|']:
			if (from === Dir.EAST || from === Dir.WEST) {
				return [Dir.NORTH, Dir.SOUTH]
			}
			return [getOppositeDir(from)]
	}
}

const testFile = './test.txt'
const dataFile = './data.txt'

const data: twoDArr = readFileSync(dataFile, 'utf8').split("\n").filter((line) => line !== "").map(line => line.split(''))
const test: twoDArr = readFileSync(testFile, 'utf8').split("\n").filter((line) => line !== "").map(line => line.split(''))

const floorMap: FloorMap = {
	contents: data,
	at: getContentsFromPos
}

const height = floorMap.contents.length
const width = floorMap.contents[0].length

// TODO: START here

function countEnergizedTitles(startingPos: Pos, startGoing: Dir): number {
	const start: Pos = startingPos
	const firstFloorTile = floorMap.at(floorMap.contents, start)
	const startingDirs = getBeamDirectionFromDir(firstFloorTile, startGoing)
	const pathStart: BeamSeg = {
		pos: start,
		contents: firstFloorTile,
		from: startGoing,
		to: startingDirs
	}
	const energizedTiles = new Map<string, Pos>()
	energizedTiles.set('' + pathStart.from + '-' + pathStart.pos.x + '-' + pathStart.pos.y, pathStart.pos)

	const tree: TreeNode = {
		contents: pathStart,
		children: followBeamPaths(floorMap, pathStart, energizedTiles)
	}

	const energizedDisplay = new Array<string[]>(height)
	for (let i = 0; i < height; i++) {
		energizedDisplay[i] = new Array(width).fill('.')
	}

	for (let coord of energizedTiles.values()) {
		if (
			coord.x >= 0 &&
			coord.x < floorMap.contents[0].length &&
			coord.y >= 0 &&
			coord.y < floorMap.contents.length
		) {
			const floorTile = floorMap.contents[coord.y][coord.x]
			energizedDisplay[coord.y][coord.x] = floorTile === '.' ? '#' : floorTile
		}
	}

	return energizedDisplay.reduce((total, line) => {
		return total + line.reduce((lineSum, char) => {
			if (char !== '.') {
				return lineSum + 1
			}
			return lineSum + 0
		}, 0)
	}, 0)

	// TODO: End here
}

const counts: number[] = new Array()

for (let y = 0; y < 2; y++) {
	for (let x = 0; x < width; x++) {
		if (y === 0) {
			counts.push(countEnergizedTitles({ x: x, y: y }, Dir.NORTH))
		} else {
			counts.push(countEnergizedTitles({ x: x, y: floorMap.contents.length - 1 }, Dir.SOUTH))
		}

	}
}

for (let x = 0; x < 2; x++) {
	for (let y = 0; y < height; y++) {
		if (x === 0) {
			counts.push(countEnergizedTitles({ x: x, y: y }, Dir.WEST))
		} else {
			counts.push(countEnergizedTitles({ x: floorMap.contents[0].length - 1, y: y }, Dir.EAST))
		}

	}
}

console.log(counts.join(','))

console.log(counts.reduce((highest, current) => {
	if (highest < current) {
		return current
	}
	return highest
}))



