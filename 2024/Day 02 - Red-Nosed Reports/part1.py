def getDifferences(line):
    difference = []
    for i in range(len(line)):
        if i == len(line) - 1:
            return difference
        difference.append(int(line[i]) - int(line[i + 1]))
    return difference


def isValid(line):
    direction = 'neutral'

    for n in line:
        match direction:
            case 'neutral':
                if (n > 0 and n <= 3):
                    direction = 'increasing'
                elif (n < 0 and n >= -3):
                    direction = 'decreasing'
                else:
                    return False
            case 'increasing':
                if (n < 1 or n > 3):
                    return False
            case 'decreasing':
                if (n < -3 or n > -1):
                    return False
    return True


with open('data.txt', 'r') as file:
    safe_lines = 0
    for raw_line in file:
        line = [int(x) for x in raw_line.rstrip('\n').split(' ')]
        diffs = getDifferences(line)

        if (isValid(diffs)):
            safe_lines += 1

        # print("% s is % s" % (line, 'Safe' if isValid(diffs) else 'UNsafe'))
    print(safe_lines)
