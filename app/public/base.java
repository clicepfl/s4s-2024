
import java.util.Scanner;

public class CheckersBoardParser {

    private record Piece(char pieceType, char pieceColor) {}
    private record Position(int row, int column) {}
    private record Move(Position from, Position to) {}

    // This method parses the board and returns each cell's content as an array of moves
    private static List<Move> findMove(Piece[][] board, char playerColor) {
        // TODO: Implement logic to find the next move
        // The moves should be returned as an array of 2-element arrays
        // The first element of the sequence should be the starting cell
        // Each subsequent 2-element array should contain the x and y coordinates of the cell to move to
        return null;
    }

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
        List<Move> moves = findMove(board, playerColor);

        if (moves == null) {
            // Error occured
            return;
        }

        // Print the moves
        for (Move move : moves) {
            System.out.println(
                move.from.row + "" + move.from.column + "," 
                + move.to.row + "" + move.to.column
            );
        }

    }
}