
class Piece:
    def __init__(self, piece_type, piece_color):
        self.piece_type = piece_type
        self.piece_color = piece_color

def find_move(board, player_color):
    # TODO: Implement logic to find the next move
    # The moves should be returned as a list of 2-element lists
    # The first element of the sequence should be the starting cell
    # Each subsequent 2-element list should contain the x and y coordinates of the cell to move to
    return []

def main():
    board = [[None for _ in range(10)] for _ in range(10)]  # Initialize a 10x10 board with None

    # Read the player's color
    player_color = input().strip()[0]

    # Read input line by line for the board
    for r in range(10):
        line = input().strip()
        row = line.split(',')  # Split the line by commas

        # Parse each element to a Piece object or None
        for c, piece_code in enumerate(row):
            if piece_code:
                board[r][c] = Piece(piece_code[0], piece_code[1])
            else:
                board[r][c] = None  # Empty cells should be None

    # Call the find_move function to find the next move
    moves = find_move(board, player_color)

    if not moves:
        # No moves found
        raise Exception("No moves were returned.")
        return

    # Print the moves
    for pos in moves:
        print(f"{pos[0][0]}{pos[0][1]},{pos[1][0]}{pos[1][1]};")

if __name__ == "__main__":
    main()