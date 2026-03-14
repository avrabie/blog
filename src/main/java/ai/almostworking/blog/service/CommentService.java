package ai.almostworking.blog.service;

import ai.almostworking.blog.model.Comment;
import ai.almostworking.blog.repository.CommentRepository;
import ai.almostworking.blog.repository.PostRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public Flux<Comment> getCommentsByPostSlug(String slug) {
        return postRepository.findBySlug(slug)
                .flatMapMany(post -> commentRepository.findAllByPostId(post.getId()));
    }

    public Mono<Comment> addComment(String slug, Comment comment) {
        return postRepository.findBySlug(slug)
                .flatMap(post -> {
                    comment.setPostId(post.getId());
                    return commentRepository.save(comment);
                });
    }

    public Mono<Comment> updateComment(Long id, Comment comment) {
        return commentRepository.findById(id)
                .flatMap(existingComment -> {
                    if (comment.getContent() != null) {
                        existingComment.setContent(comment.getContent());
                    }
                    if (comment.getAuthor() != null) {
                        existingComment.setAuthor(comment.getAuthor());
                    }
                    return commentRepository.save(existingComment);
                });
    }

    public Mono<Void> deleteComment(Long id) {
        return commentRepository.deleteById(id);
    }
}
