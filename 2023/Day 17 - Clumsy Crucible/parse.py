import sys

with open(sys.argv[1]) as file_desc:
    raw_file = file_desc.read()
raw_file = raw_file.strip()

grid_rows = raw_file.split('\n')

grid = [[int(x) for x in row] for row in grid_rows]

height = len(grid)
width = len(grid[0])

end_x = width - 1
end_y = height - 1

# Initialize the DSAs
state_queues_by_cost = {}
seen_cost_by_state = {}


def add_state(cost, x, y):

    # Do bounds checking
    if x < 0 or y < 0:
        return
    if x >= width or y >= width:
        return

    # calculate the cost of stepping on this square
    new_cost = cost + grid[y][x]

    # check if we found the end
    if x == end_x and y == end_y:
        print(">>>", new_cost, "<<<")
        sys.exit(0)

    # Current location
    state = (x, y)

    # Add that state to queue
    if state not in seen_cost_by_state:
        state_queues_by_cost.setdefault(new_cost, []).append(state)

        seen_cost_by_state[state] = new_cost

# Initial state
add_state(cost = 0, x = 0, y = 0)

# Iterate to find the end
while True:
    current_cost = min(state_queues_by_cost.keys())

    next_states = state_queues_by_cost.pop(current_cost)

    for state in next_states:
    # process states here
        (x, y) = state

        add_state(cost=current_cost, x=x + 1, y=y)
        add_state(cost=current_cost, x=x - 1, y=y)
        add_state(cost=current_cost, x=x, y=y + 1)
        add_state(cost=current_cost, x=x, y=y - 1)
