import { SubmissionLanguage } from "@/api/models";
import CodeSwitcher from "@/components/CodeSwitcher";
import { getInitialCode, initFiles } from "@/util/initCodeFiles";

export default function Hints() {
  return (
    <main>
      <div className="topbar">
        <img className="logo" src="../s4s/clic.svg" />
        <h1>Hints</h1>
        <div></div>
      </div>

      <div className="article-page">
        <h2>Général</h2>
        <p>
          Le plateau de jeu est composé de 100 cases, orienté de façon à ce que
          chaque joueur ait une case blanche à droite de la rangée la plus
          proche de lui.
        </p>
        <p>
          Chaque joueur commence avec trois rangées de pions de sa couleur. On
          ne joue que sur les cases noires.
        </p>

        <p>
          Il y a deux types de pièces. Les pions sont les seules pièces en début
          de partie. Un pion atteignant la dernière rangée du camp adverse
          devient une dame. Les coups possibles des pièces seront détaillés
          ci-dessous.
        </p>

        <div className="note">
          <h3>Index des cases</h3>
          <p>
            Pour décrire un case, on utilise ses coordonnées (row, col) où row
            est le numéro de la rangée (en partant de 0: la première rangé) et
            col est le numéro de la colonne (en partant de 0: la première
            colonne).
            <br />
            Notez que l'orientation du plateau considéré pour ces coordonnées
            est telle que <b>le joueur blanc est toujours en bas</b> ! Alors que
            le plateau affiché à l'écran est orienté avec le joueur "manuel" en
            bas et l'IA en haut.
          </p>
        </div>

        <h2>Déplacements</h2>

        <h3>Pion</h3>

        <p>
          Un pion peut se déplacer en diagonale de 1 case vers l'avant (vers le
          camp adverse) si la case d'arrivée est vide.
        </p>

        <h3>Dame</h3>

        <p>
          Une dame peut se déplacer en diagonale dans n'importe quelle direction
          jusqu'à rencontrer une autre pièce ou le bord du plateau.
        </p>

        <h2>Prise</h2>

        <p>
          Une prise est un déplacement qui prend une pièce adverse. Une prise
          est prioritaire sur un déplacement simple : si une prise est possible,
          elle doit être effectuée plutôt qu'un déplacement.
        </p>

        <h3>Pion</h3>

        <p>
          Un pion peut prendre une pièce adverse adjacente (en diagonale) en
          sautant par dessus elle si la case derrière est vide. Contrairement au
          déplacement simple, une prise peut être faite dans n'import quelle
          direction.
          <br />
          Le pion peut continuer à prendre des pièces adverses en enchainant les
          sauts tant que c'est possible (rafle, voir plus loin).
        </p>

        <h3>Dame</h3>

        <p>
          Une dame peut prendre une pièce adverse (même non adjacente) en
          sautant par dessus elle si la case derrière est vide.
          <br />
          Elle peut continuer à prendre des pièces adverses en enchainant les
          sauts tant que c'est possible (rafle, voir plus loin).
        </p>

        <h2>Rafle</h2>

        <p>
          Une rafle est une série de prises effectuées par une seule pièce (pion
          ou dame) sans interruption, en un seul tour.
          <br />
          Une rafle est obligatoire si elle est possible, et doit être effectuée
          avec la pièce qui permet de prendre le plus de pièces adverses.
          <br />
          Le type de pièce prise n'importe pas pour déterminer la priorité d'une
          rafle, uniquement le nombre de prises (3 pions pris sont prioritaires
          à 2 dames prises.). Si plusieurs rafles de la longueur maximale sont
          possibles, le joueur peut choisir laquelle jouer.
        </p>

        <h2>Fin de partie</h2>

        <p>
          La partie est gagnée par le joueur qui a pris tous les pions de son
          adversaire ou qui a bloqué tous les pions adverses (plus de coups
          possibles).
        </p>

        <h2>Approche pour le code</h2>

        <p>
          Pour implémenter votre IA, vous devrez écrire une fonction qui prend
          en paramètre le plateau de jeu et le joueur actuel, et qui retourne le
          coup à jouer.
        </p>

        <p>
          Vous pouvez commencer par écrire une fonction qui retourne tous les
          coups possibles pour une pièce donnée.
        </p>

        <p>
          Ensuite, vous pouvez écrire une fonction qui retourne tous les coups
          possibles pour un joueur donné, en trouvant les coups pour chacune des
          pièces du joueur, puis en prenant en compte les coups prioritaires et
          les rafles.
        </p>

        <p>
          Enfin, vous pouvez écrire une fonction qui retourne le meilleur coup
          possible pour un joueur donné (ou dans un premier temps, un des cousp
          possibles)
        </p>

        <h2>Morceaux de Solution !</h2>

        <h3>Déplacements Possibles (Pions)</h3>

        <CodeSwitcher
          codeSnippets={{
            [SubmissionLanguage.Java]: `// Vérifie les mouvements simples possibles et retourne une liste de ces mouvements
private static List<Move> findSimpleMoves(Piece[][] board, int fromRow, int fromCol, int direction) {
    List<Move> simpleMoves = new ArrayList<>();

    // Vérifier la diagonale gauche
    if (isValidMove(board, fromRow + direction, fromCol - 1)) {
        simpleMoves.add(new Move(new Position(fromRow, fromCol), new Position(fromRow + direction, fromCol - 1)));
    }

    // Vérifier la diagonale droite
    if (isValidMove(board, fromRow + direction, fromCol + 1)) {
        simpleMoves.add(new Move(new Position(fromRow, fromCol), new Position(fromRow + direction, fromCol + 1)));
    }

    return simpleMoves;
}

// Vérifie si un mouvement simple est valide
private static boolean isValidMove(Piece[][] board, int toRow, int toCol) {
    return isValidPosition(board, toRow, toCol) && board[toRow][toCol] == null;
}

// Vérifie si une position est dans les limites du plateau
private static boolean isValidPosition(Piece[][] board, int row, int col) {
    return row >= 0 && row < board.length && col >= 0 && col < board[row].length;
}`,
            [SubmissionLanguage.Cpp]: `bool isValidMove(const std::vector<std::vector<std::optional<Piece>>>& board, int toRow, int toCol);
bool isValidPosition(const std::vector<std::vector<std::optional<Piece>>>& board, int row, int col);

// Vérifie les mouvements simples possibles et retourne une liste de ces mouvements
std::vector<Move> findSimpleMoves(const std::vector<std::vector<std::optional<Piece>>>& board, int fromRow, int fromCol, int direction) {
    std::vector<Move> simpleMoves;

    // Vérifier la diagonale gauche
    if (isValidMove(board, fromRow + direction, fromCol - 1)) {
        simpleMoves.push_back({{fromRow, fromCol}, {fromRow + direction, fromCol - 1}});
    }

    // Vérifier la diagonale droite
    if (isValidMove(board, fromRow + direction, fromCol + 1)) {
        simpleMoves.push_back({{fromRow, fromCol}, {fromRow + direction, fromCol + 1}});
    }

    return simpleMoves;
}
    
// Vérifie si un mouvement simple est valide
bool isValidMove(const std::vector<std::vector<std::optional<Piece>>>& board, int toRow, int toCol) {
    return isValidPosition(board, toRow, toCol) && !board[toRow][toCol];
}
    
// Vérifie si une position est dans les limites du plateau
bool isValidPosition(const std::vector<std::vector<std::optional<Piece>>>& board, int row, int col) {
    return row >= 0 && row < board.size() && col >= 0 && col < board[0].size();
}`,
            [SubmissionLanguage.Python]: `def find_simple_moves(board, from_row, from_col, direction):
    simple_moves = []

    # Vérifier la diagonale gauche
    if is_valid_move(board, from_row + direction, from_col - 1):
        simple_moves.append(Move(Position(from_row, from_col), Position(from_row + direction, from_col - 1)))

    # Vérifier la diagonale droite
    if is_valid_move(board, from_row + direction, from_col + 1):
        simple_moves.append(Move(Position(from_row, from_col), Position(from_row + direction, from_col + 1)))

    return simple_moves


def is_valid_move(board, to_row, to_col):
    return is_valid_position(board, to_row, to_col) and board[to_row][to_col] is None


def is_valid_position(board, row, col):
    return 0 <= row < len(board) and 0 <= col < len(board[0])`,
          }}
        ></CodeSwitcher>

        <h3>Prises Possibles (Pions)</h3>

        <CodeSwitcher
          codeSnippets={{
            [SubmissionLanguage.Java]: `
// Vérifie les captures possibles et retourne une liste de ces mouvements
private static List<Move> findCaptures(Piece[][] board, int fromRow, int fromCol, int direction, char playerColor) {
    List<Move> captureMoves = new ArrayList<>();

    // Vérifier la capture par la diagonale gauche
    if (canCapture(board, fromRow, fromCol, fromRow + direction, fromCol - 1, fromRow + 2 * direction, fromCol - 2, playerColor)) {
        captureMoves.add(new Move(new Position(fromRow, fromCol), new Position(fromRow + 2 * direction, fromCol - 2)));
    }

    // Vérifier la capture par la diagonale droite
    if (canCapture(board, fromRow, fromCol, fromRow + direction, fromCol + 1, fromRow + 2 * direction, fromCol + 2, playerColor)) {
        captureMoves.add(new Move(new Position(fromRow, fromCol), new Position(fromRow + 2 * direction, fromCol + 2)));
    }

    return captureMoves;
}

// Vérifie si un mouvement simple est valide
private static boolean isValidMove(Piece[][] board, int toRow, int toCol) {
    return isValidPosition(board, toRow, toCol) && board[toRow][toCol] == null;
}

// Vérifie si une capture est possible
private static boolean canCapture(Piece[][] board, int fromRow, int fromCol, int overRow, int overCol, int toRow, int toCol, char playerColor) {
    if (!isValidPosition(board, toRow, toCol)) {
        return false;
    }

    // La case de destination doit être vide
    if (board[toRow][toCol] != null) {
        return false;
    }

    // La pièce au-dessus doit être une pièce adverse
    Piece middlePiece = board[overRow][overCol];
    return middlePiece != null && middlePiece.pieceColor() != playerColor;
}

// Vérifie si une position est dans les limites du plateau
private static boolean isValidPosition(Piece[][] board, int row, int col) {
    return row >= 0 && row < board.length && col >= 0 && col < board[row].length;
}

            `,
            [SubmissionLanguage.Cpp]: `bool canCapture(const std::vector<std::vector<std::optional<Piece>>>& board, int fromRow, int fromCol, int overRow, int overCol, int toRow, int toCol, char playerColor);
bool isValidPosition(const std::vector<std::vector<std::optional<Piece>>>& board, int row, int col);


// Vérifie les captures possibles et retourne une liste de ces mouvements
std::vector<Move> findCaptures(const std::vector<std::vector<std::optional<Piece>>>& board, int fromRow, int fromCol, int direction, char playerColor) {
    std::vector<Move> captureMoves;

    // Vérifier la capture par la diagonale gauche
    if (canCapture(board, fromRow, fromCol, fromRow + direction, fromCol - 1, fromRow + 2 * direction, fromCol - 2, playerColor)) {
        captureMoves.push_back({{fromRow, fromCol}, {fromRow + 2 * direction, fromCol - 2}});
    }

    // Vérifier la capture par la diagonale droite
    if (canCapture(board, fromRow, fromCol, fromRow + direction, fromCol + 1, fromRow + 2 * direction, fromCol + 2, playerColor)) {
        captureMoves.push_back({{fromRow, fromCol}, {fromRow + 2 * direction, fromCol + 2}});
    }

    return captureMoves;
}


// Vérifie si une capture est possible
bool canCapture(const std::vector<std::vector<std::optional<Piece>>>& board, int fromRow, int fromCol, int overRow, int overCol, int toRow, int toCol, char playerColor) {
    if (!isValidPosition(board, toRow, toCol) || board[toRow][toCol]) {
        return false;
    }

    // La pièce à capturer doit appartenir à l'adversaire
    const auto& middlePiece = board[overRow][overCol];
    return middlePiece && middlePiece->pieceColor != playerColor;
}

// Vérifie si une position est dans les limites du plateau
bool isValidPosition(const std::vector<std::vector<std::optional<Piece>>>& board, int row, int col) {
    return row >= 0 && row < board.size() && col >= 0 && col < board[0].size();
}`,
            [SubmissionLanguage.Python]: `def find_captures(board, from_row, from_col, direction, player_color):
    capture_moves = []

    # Vérifier la capture par la diagonale gauche
    if can_capture(board, from_row, from_col, from_row + direction, from_col - 1, from_row + 2 * direction, from_col - 2, player_color):
        capture_moves.append(Move(Position(from_row, from_col), Position(from_row + 2 * direction, from_col - 2)))

    # Vérifier la capture par la diagonale droite
    if can_capture(board, from_row, from_col, from_row + direction, from_col + 1, from_row + 2 * direction, from_col + 2, player_color):
        capture_moves.append(Move(Position(from_row, from_col), Position(from_row + 2 * direction, from_col + 2)))

    return capture_moves
    
def can_capture(board, from_row, from_col, over_row, over_col, to_row, to_col, player_color):
    if not is_valid_position(board, to_row, to_col):
        return False

    # La case de destination doit être vide
    if board[to_row][to_col] is not None:
        return False

    # La pièce à capturer doit être une pièce adverse
    middle_piece = board[over_row][over_col]
    return middle_piece is not None and middle_piece.piece_color != player_color


def is_valid_position(board, row, col):
    return 0 <= row < len(board) and 0 <= col < len(board[0])`,
          }}
        ></CodeSwitcher>
      </div>
    </main>
  );
}
