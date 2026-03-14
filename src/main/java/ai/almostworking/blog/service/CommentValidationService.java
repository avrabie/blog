package ai.almostworking.blog.service;

import ai.almostworking.blog.exception.InvalidCommentException;
import ai.almostworking.blog.model.Comment;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class CommentValidationService {

    public Mono<Comment> validateForCreate(Comment comment) {
        if (comment.getAuthor() == null || comment.getAuthor().trim().isEmpty()) {
            return Mono.error(new InvalidCommentException("Author cannot be empty"));
        }
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            return Mono.error(new InvalidCommentException("Content cannot be empty"));
        }
        return Mono.just(comment);
    }

    public Mono<Comment> validateForUpdate(Comment comment) {
        if (comment.getAuthor() != null && comment.getAuthor().trim().isEmpty()) {
            return Mono.error(new InvalidCommentException("Author cannot be empty"));
        }
        if (comment.getContent() != null && comment.getContent().trim().isEmpty()) {
            return Mono.error(new InvalidCommentException("Content cannot be empty"));
        }
        return Mono.just(comment);
    }
}
