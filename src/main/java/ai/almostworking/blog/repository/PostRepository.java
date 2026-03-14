package ai.almostworking.blog.repository;

import ai.almostworking.blog.model.Post;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

/**
 * Repository for managing {@link Post} entities.
 * Using R2DBC for reactive database access.
 */
@Repository
public interface PostRepository extends R2dbcRepository<Post, Long> {
    
    /**
     * Find a post by its slug.
     * 
     * @param slug the post slug
     * @return a Mono of the post
     */
    Mono<Post> findBySlug(String slug);
}
