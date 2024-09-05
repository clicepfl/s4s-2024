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

        <h3>Coups Possibles (Pion)</h3>

        <CodeSwitcher
          codeSnippets={{
            [SubmissionLanguage.Java]: `
static List<MoveWithTaken> calculateManRegularMoves(Board board, int x, int y) {
  List<MoveWithTaken> moves = new ArrayList<>();
  int[][] directions = { {-1, -1}, {1, -1} };

  for (int[] dir : directions) {
      int newX = x + dir[0];
      int newY = y + dir[1];

      if (isWithinBoard(newX, newY, board) && board.getPiece(newX, newY) == null) {
          moves.add(new MoveWithTaken(newX, newY, null));
      }
  }

  return moves;
}

static List<MoveWithTaken> calculateManTakeMoves(Board board, Piece piece, int x, int y) {
  List<MoveWithTaken> moves = new ArrayList<>();
  int[][] directions = { {-1, -1}, {1, -1}, {-1, 1}, {1, 1} };

  for (int[] dir : directions) {
      int takenX = x + dir[0];
      int takenY = y + dir[1];
      int newX = x + 2 * dir[0];
      int newY = y + 2 * dir[1];

      if (isWithinBoard(newX, newY, board)) {
          Piece takenCell = board.getPiece(takenX, takenY);
          Piece newCell = board.getPiece(newX, newY);

          if (takenCell != null && !takenCell.player.equals(piece.player) && newCell == null) {
              moves.add(new MoveWithTaken(newX, newY, new Position(takenX, takenY)));
          }
      }
  }

  return moves;
}
            `,
            [SubmissionLanguage.Cpp]: "test code cpp",
            [SubmissionLanguage.Python]: "test code python",
          }}
        ></CodeSwitcher>
      </div>
    </main>
  );
}
