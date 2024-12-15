puzzle = []
with open('./data.txt', 'r') as file:
    for line in file:
        puzzle.append(line.rstrip('\n'))

matches = 0

rows = len(puzzle)
columns = len(puzzle[0])
for i in range(rows):
    if (i == 0 or i == rows - 1):
        continue
    for j in range(columns):
        if (j == 0 or j == columns - 1):
            continue
        if (puzzle[i][j] == 'A'):
            x = [puzzle[i-1][j-1]+'A'+puzzle[i+1][j+1],
                 puzzle[i+1][j-1]+'A'+puzzle[i-1][j+1]]

            if ((x[0] == "MAS" or x[0] == "SAM") and
                    (x[1] == "MAS" or x[1] == "SAM")):
                matches += 1

# Rotate puzzle for next loop
puzzle = list([''.join(map(str, i)) for i in zip(*puzzle[::-1])])

print(matches)
