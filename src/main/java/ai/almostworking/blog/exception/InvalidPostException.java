package ai.almostworking.blog.exception;

public class InvalidPostException extends RuntimeException {
    public InvalidPostException(String message) {
        super(message);
    }
}
