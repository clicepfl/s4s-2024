import { SubmissionLanguage } from "./api/models";

export const initFiles: {
  [lang: string]: { name: string; value: string };
} = {
  [SubmissionLanguage.Java]: {
    name: "Java",
    value: `
import java.util.Scanner;

public class CheckersBoardParser {

    private record Piece(char pieceType, char pieceColor) {}

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Piece[][] board = new Piece[10][10]; // Initialize a 10x10 board

        char playerColor = scanner.nextLine().charAt(0);

        // Read input line by line
        for (int r = 0; r < 10; r++) {
            String line = scanner.nextLine();
            String[] row = line.split(","); // Split the line by commas
            Piece[] pieceRow = new Piece[row.length];
            for (int c = 0; c < row.length; c++) {
                String pieceCode = row[c];
                if (!pieceCode.isEmpty()) {
                    pieceRow[c] = new Piece(pieceCode.charAt(0), pieceCode.charAt(1));
                } else {
                    pieceRow[c] = null; // Empty cells should be null
                }
            }
            
            board[r] = pieceRow; // Add the row to the board
        }

        // Close the scanner to avoid resource leak
        scanner.close();

        // Call the findMove method to find the next move
        int[][] moves = findMove(board, playerColor);

        if (moves == null) {
            // Error occured
            return;
        }

        // Print the moves
        for (int[] pos : moves) {
            System.out.println(pos[0] + "," + pos[1]);
        }

    }

    // This method parses the board and returns each cell's content as an array of moves
    private static int[][] findMove(Piece[][] board, char playerColor) {
        // TODO: Implement logic to find the next move
        // The moves should be returned as an array of 2-element arrays
        // The first element of the sequence should be the starting cell
        // Each subsequent 2-element array should contain the x and y coordinates of the cell to move to
        return null;
    }
}
`,
  },
  [SubmissionLanguage.Cpp]: {
    name: "C++",
    value: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <optional>  // Include the optional header

// Define the Piece structure similar to Java's record
struct Piece {
    char pieceType;
    char pieceColor;
    Piece(char type, char color) : pieceType(type), pieceColor(color) {}
};

// Function to parse the board and return each cell's content as a vector of moves
std::vector<std::vector<int>> findMove(const std::vector<std::vector<std::optional<Piece>>>& board, char playerColor) {
    // TODO: Implement logic to find the next move
    // The moves should be returned as a vector of 2-element vectors
    // The first element of the sequence should be the starting cell
    // Each subsequent 2-element vector should contain the x and y coordinates of the cell to move to
    return {};
}

int main() {
    // Initialize a 10x10 board with std::optional<Piece>
    std::vector<std::vector<std::optional<Piece>>> board(10, std::vector<std::optional<Piece>>(10));
    char playerColor;

    // Read the player's color
    std::cin >> playerColor;
    std::cin.ignore(); // Ignore the newline character after reading playerColor

    // Read input line by line for the board
    for (int r = 0; r < 10; r++) {
        std::string line;
        std::getline(std::cin, line); // Read the entire line
        std::stringstream ss(line);
        std::string pieceCode;
        int c = 0;

        // Split the line by commas
        while (std::getline(ss, pieceCode, ',')) {
            if (!pieceCode.empty()) {
                board[r][c] = Piece(pieceCode[0], pieceCode[1]); // Use std::optional to directly create a Piece
            } else {
                board[r][c].reset(); // Use reset() to clear the optional if it's empty
            }
            c++;
        }
    }

    // Call the findMove function to find the next move
    std::vector<std::vector<int>> moves = findMove(board, playerColor);

    if (moves.empty()) {
        // No moves found
        std::cerr << "No moves were returned." << std::endl;
        return 0;
    }

    // Print the moves
    for (const auto& pos : moves) {
        std::cout << pos[0] << "," << pos[1] << std::endl;
    }

    return 0;
}
`,
  },
  [SubmissionLanguage.Python]: {
    name: "Python",
    value: `
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
        print(f"{pos[0]},{pos[1]}")

if __name__ == "__main__":
    main()
`,
  },
};
