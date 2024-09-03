
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

struct Position {
    int row;
    int column;
};

struct Move {
    Position from;
    Position to;
};

// Function to parse the board and return each cell's content as a vector of moves
std::vector<Move> findMove(const std::vector<std::vector<std::optional<Piece>>>& board, char playerColor) {
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
    auto moves = findMove(board, playerColor);

    if (moves.empty()) {
        // No moves found
        std::cerr << "No moves were returned." << std::endl;
        return 0;
    }

    // Print the moves
    for (const auto& pos : moves) {
        std::cout 
            << pos.from.row << pos.from.column << "," 
            << pos.to.row << pos.to.column << ";";
    }
    std::cout << std::endl;

    return 0;
}