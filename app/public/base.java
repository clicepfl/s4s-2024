import java.util.List;
import java.util.Scanner;

public class base {
    // pieceType: 'M' pour pion, 'K' pour dame
    // pieceColor: 'W' pour blanc, 'B' pour noir
    private record Piece(char pieceType, char pieceColor) {}

    // row: numéro de la ligne, column: numéro de la colonne
    private record Position(int row, int column) {}

    // from: position de départ, to: position d'arrivée
    private record Move(Position from, Position to) {}

    // Fonction pour trouver les coups à jouer
    private static List<Move> findMove(Piece[][] board, char playerColor) {

        // TODO: Implémentez ici la logique pour trouver les coups à jouer et les retourner
        // Les coups doivent être retournés sous forme d'une liste d'objets Move,
        // Chaque objet Move représente un coup, avec une cellule de départ et une cellule d'arrivée
        // Les classes Position(row, column) et Move(from, to) sont fournies pour vous

        List<Move> moves = List.of(new Move(new Position(6,1), new Position(5,0)));
        
        return moves;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Piece[][] board = new Piece[10][10];

        // Lecture de la couleur du joueur depuis la console
        char playerColor = scanner.nextLine().charAt(0);

        // Parsage du plateau de jeu depuis la console
        for (int r = 0; r < 10; r++) {
            String line = scanner.nextLine();
            String[] row = line.split(",");
            Piece[] pieceRow = new Piece[row.length];
            for (int c = 0; c < row.length; c++) {
                String pieceCode = row[c];
                if (!pieceCode.isEmpty()) {
                    pieceRow[c] = new Piece(pieceCode.charAt(0), pieceCode.charAt(1));
                } else {
                    pieceRow[c] = null;
                }
            }
            
            board[r] = pieceRow;
        }

        scanner.close();

        // Appel de la fonction findMove pour trouver les coups à jouer
        List<Move> moves = findMove(board, playerColor);

        if (moves == null) {
            return;
        }

        // Envoi des coups trouvés à la console
        for (Move move : moves) {
            System.out.print(
                move.from.row + "" + move.from.column + "," 
                + move.to.row + "" + move.to.column + ";"
            );
        }
        System.out.println("");
    }
}