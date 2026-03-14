package ai.almostworking.blog.service;

import ai.almostworking.blog.exception.InvalidPostException;
import ai.almostworking.blog.model.Post;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PostValidationService {

    public Mono<Post> validateForCreate(Post post) {
        if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
            return Mono.error(new InvalidPostException("Title cannot be empty"));
        }
        if (post.getContent() == null || post.getContent().trim().isEmpty()) {
            return Mono.error(new InvalidPostException("Content cannot be empty"));
        }
        return Mono.just(post);
    }

    public Mono<Post> validateForUpdate(Post post) {
        if (post.getTitle() != null && post.getTitle().trim().isEmpty()) {
            return Mono.error(new InvalidPostException("Title cannot be empty"));
        }
        return Mono.just(post);
    }
}
