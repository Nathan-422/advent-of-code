left_list = []
right_list = []

with open("./data.txt", "r") as file:

    for line in file:

        values = line.rstrip("\n").split("   ")
        left = int(values[0])
        right = int(values[1])

        left_list.append(left)
        right_list.append(right)

left_list.sort()
right_list.sort()

sum = 0

for i in range(len(left_list)):

    sum += abs(left_list[i] - right_list[i])

print(sum)
