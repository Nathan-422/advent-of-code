left_list = []
right_list = {}

with open("./data.txt", "r") as file:

    for line in file:

        values = line.rstrip("\n").split("   ")

        left = int(values[0])
        left_list.append(left)

        right = int(values[1])

        if (right in right_list.keys()):
            right_list[right] += 1
        else:
            right_list.setdefault(right, 1)

sum = 0

for id in left_list:

    appearances = right_list[id] if id in right_list.keys() else 0
    sum += id * appearances

print(sum)
