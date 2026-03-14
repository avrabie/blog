package ai.almostworking.blog.service;

import ai.almostworking.blog.exception.PostAlreadyExistsException;
import ai.almostworking.blog.model.Post;
import ai.almostworking.blog.repository.PostRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class BlogService {

    private final PostRepository postRepository;
    private final SlugService slugService;

    public BlogService(PostRepository postRepository, SlugService slugService) {
        this.postRepository = postRepository;
        this.slugService = slugService;
    }

    public Flux<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Mono<Post> getPostBySlug(String slug) {
        return postRepository.findBySlug(slug);
    }

    public Mono<Post> createPost(Post post) {
        if (post.getSlug() == null || post.getSlug().isEmpty()) {
            post.setSlug(slugService.makeSlug(post.getTitle()));
        }
        return postRepository.save(post)
                .onErrorResume(DuplicateKeyException.class, e -> Mono.error(new PostAlreadyExistsException("A post with this slug already exists: " + post.getSlug(), e)));
    }

    public Mono<Post> updatePost(String slug, Post post) {
        return postRepository.findBySlug(slug)
                .flatMap(existingPost -> {
                    if (post.getSlug() != null && !post.getSlug().isEmpty()) {
                        existingPost.setSlug(post.getSlug());
                    } else if (post.getTitle() != null && !post.getTitle().equals(existingPost.getTitle())) {
                        existingPost.setSlug(slugService.makeSlug(post.getTitle()));
                    }

                    if (post.getTitle() != null) {
                        existingPost.setTitle(post.getTitle());
                    }
                    if (post.getContent() != null) {
                        existingPost.setContent(post.getContent());
                    }
                    if (post.getAuthor() != null) {
                        existingPost.setAuthor(post.getAuthor());
                    }
                    return postRepository.save(existingPost)
                            .onErrorResume(DuplicateKeyException.class, e -> Mono.error(new PostAlreadyExistsException("A post with this slug already exists: " + existingPost.getSlug(), e)));
                });
    }

    public Mono<Void> deletePost(String slug) {
        return postRepository.findBySlug(slug)
                .flatMap(postRepository::delete);
    }
}
