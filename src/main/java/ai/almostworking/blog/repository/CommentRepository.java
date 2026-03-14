package ai.almostworking.blog.repository;

import ai.almostworking.blog.model.Comment;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

/**
 * Repository for managing {@link Comment} entities.
 * Using R2DBC for reactive database access.
 */
@Repository
public interface CommentRepository extends R2dbcRepository<Comment, Long> {
    
    /**
     * Find all comments for a specific post.
     * 
     * @param postId the post ID
     * @return a Flux of comments
     */
    Flux<Comment> findAllByPostId(Long postId);
}
