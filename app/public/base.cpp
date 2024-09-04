#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <optional>


struct Piece {
    char pieceType; // pieceType: 'M' pour pion, 'K' pour dame
    char pieceColor; // pieceColor: 'W' pour blanc, 'B' pour noir
    Piece(char type, char color) : pieceType(type), pieceColor(color) {}
};

struct Position {
    int row; // row: ligne de la cellule
    int column; // column: colonne de la cellule
};

struct Move {
    Position from; // from: cellule de départ
    Position to; // to: cellule d'arrivée
};

// Fonction pour trouver les coups à jouer
std::vector<Move> findMove(const std::vector<std::vector<std::optional<Piece>>>& board, char playerColor) {
    
    // TODO: Implémentez ici la logique pour trouver les coups à jouer et les retourner
    // Les coups doivent être retournés sous forme d'une liste d'objets Move,
    // Chaque objet Move représente un coup, avec une cellule de départ et une cellule d'arrivée
    // Les classes Position(row, column) et Move(from, to) sont fournies pour vous

    Position start = {6, 1};
    Position end = {5, 0};
    Move move = {start, end};

    std::vector<Move> moves;
    moves.push_back(move);

    return moves;
}

int main() {
    std::vector<std::vector<std::optional<Piece>>> board(10, std::vector<std::optional<Piece>>(10));
    char playerColor;

    // Lecture de la couleur du joueur depuis la console
    std::cin >> playerColor;
    std::cin.ignore(); // Ignore the newline character after reading playerColor

    // Parsage du plateau de jeu depuis la console
    for (int r = 0; r < 10; r++) {
        std::string line;
        std::getline(std::cin, line);
        std::stringstream ss(line);
        std::string pieceCode;
        int c = 0;

        while (std::getline(ss, pieceCode, ',')) {
            if (!pieceCode.empty()) {
                board[r][c] = Piece(pieceCode[0], pieceCode[1]);
            } else {
                board[r][c].reset();
            }
            c++;
        }
    }

    // Appel de la fonction findMove pour trouver les coups à jouer
    auto moves = findMove(board, playerColor);

    if (moves.empty()) {
        std::cerr << "No moves were returned." << std::endl;
        return 0;
    }

    // Envoi des coups trouvés à la console
    for (const auto& pos : moves) {
        std::cout 
            << pos.from.row << pos.from.column << "," 
            << pos.to.row << pos.to.column << ";";
    }
    std::cout << std::endl;

    return 0;
}