import java.util.Scanner;

public class HillCipher {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Enter the 2x2 key matrix ");
        int[][] keyMatrix = new int[2][2];
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                keyMatrix[i][j] = scanner.nextInt();
            }
        }

        System.out.print("Enter the plaintext (in uppercase): ");
        scanner.nextLine();  
        String plaintext = scanner.nextLine();

        if (plaintext.length() % 2 != 0) {
            plaintext += "X";
        }

        String ciphertext = encrypt(keyMatrix, plaintext);

        System.out.println("Encrypted Text: " + ciphertext);

        scanner.close();
    }

    

    private static String encrypt(int[][] keyMatrix, String plaintext) {
        StringBuilder ciphertext = new StringBuilder();

        for (int i = 0; i < plaintext.length(); i += 2) {
            int[] block = new int[2];
            block[0] = plaintext.charAt(i) - 'A';
            block[1] = plaintext.charAt(i + 1) - 'A';

            int encrypted1 = (keyMatrix[0][0] * block[0] + keyMatrix[0][1] * block[1]) % 26;
            int encrypted2 = (keyMatrix[1][0] * block[0] + keyMatrix[1][1] * block[1]) % 26;

            ciphertext.append((char) (encrypted1 + 'A')).append((char) (encrypted2 + 'A'));
        }

        return ciphertext.toString();
    }
}
