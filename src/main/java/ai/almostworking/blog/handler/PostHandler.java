package ai.almostworking.blog.handler;

import ai.almostworking.blog.exception.InvalidPostException;
import ai.almostworking.blog.exception.PostAlreadyExistsException;
import ai.almostworking.blog.exception.PostNotFoundException;
import ai.almostworking.blog.model.ErrorResponse;
import ai.almostworking.blog.model.Post;
import ai.almostworking.blog.service.BlogService;
import ai.almostworking.blog.service.PostValidationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;

@Service
public class PostHandler {

    private final BlogService blogService;
    private final PostValidationService postValidationService;
    private final String apiPrefix;

    public PostHandler(BlogService blogService, PostValidationService postValidationService, @Value("${blog.api.prefix:/api/blog}") String apiPrefix) {
        this.blogService = blogService;
        this.postValidationService = postValidationService;
        this.apiPrefix = apiPrefix;
    }

    public Mono<ServerResponse> getAllPosts(ServerRequest serverRequest) {
        Flux<Post> posts = blogService.getAllPosts();
        return ServerResponse.ok().body(posts, Post.class);
    }

    public Mono<ServerResponse> getPostBySlug(ServerRequest request) {
        String slug = request.pathVariable("slug");
        return blogService.getPostBySlug(slug)
                .flatMap(post -> ServerResponse.ok().bodyValue(post))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> createPost(ServerRequest request) {
        return request.bodyToMono(Post.class)
                .flatMap(postValidationService::validateForCreate)
                .flatMap(blogService::createPost)
                .flatMap(post -> ServerResponse.created(request.uriBuilder().path("/{slug}").build(post.getSlug())).bodyValue(post))
                .onErrorResume(PostAlreadyExistsException.class, e -> ServerResponse.status(HttpStatus.CONFLICT).bodyValue(new ErrorResponse(e.getMessage())))
                .onErrorResume(InvalidPostException.class, e -> ServerResponse.badRequest().bodyValue(new ErrorResponse(e.getMessage())));
    }

    public Mono<ServerResponse> updatePost(ServerRequest request) {
        String slug = request.pathVariable("slug");
        return request.bodyToMono(Post.class)
//                .flatMap(postValidationService::validateForUpdate)
                .flatMap(post -> blogService.updatePost(slug, post))
                .flatMap(post -> ServerResponse.ok().bodyValue(post))
                .switchIfEmpty(ServerResponse.notFound().build())
                .onErrorResume(PostAlreadyExistsException.class, e -> ServerResponse.status(HttpStatus.CONFLICT).bodyValue(new ErrorResponse(e.getMessage())))
                .onErrorResume(InvalidPostException.class, e -> ServerResponse.badRequest().bodyValue(new ErrorResponse(e.getMessage())));
    }

    public Mono<ServerResponse> deletePost(ServerRequest request) {
        String slug = request.pathVariable("slug");
        return blogService.deletePost(slug)
                .then(ServerResponse.noContent().build());
    }

    public Mono<ServerResponse> deleteAllPosts(ServerRequest serverRequest) {
        return blogService.deleteAllPosts()
                .then(ServerResponse.noContent().build());
    }

    public Mono<ServerResponse> deletePostById(ServerRequest serverRequest) {
        long id = Long.parseLong(serverRequest.pathVariable("id"));
        Mono<Void> voidMono = blogService.deletePostById(id);
        return voidMono
                .then(ServerResponse.noContent().build())
                .onErrorResume(PostNotFoundException.class, e -> ServerResponse.status(HttpStatus.NOT_FOUND).bodyValue(new ErrorResponse(e.getMessage())))
                ;
    }
}
