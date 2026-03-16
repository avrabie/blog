package ai.almostworking.blog.handler;

import ai.almostworking.blog.exception.InvalidCommentException;
import ai.almostworking.blog.model.Comment;
import ai.almostworking.blog.model.ErrorResponse;
import ai.almostworking.blog.model.Post;
import ai.almostworking.blog.service.BlogService;
import ai.almostworking.blog.service.CommentService;
import ai.almostworking.blog.service.CommentValidationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.time.Duration;

@Service
public class CommentHandler {

    private final CommentService commentService;
    private final CommentValidationService commentValidationService;
    private final BlogService blogService;
    private final String apiPrefix;

    public CommentHandler(CommentService commentService, CommentValidationService commentValidationService, BlogService blogService, @Value("${blog.api.prefix:/api/blog}") String apiPrefix) {
        this.commentService = commentService;
        this.commentValidationService = commentValidationService;
        this.blogService = blogService;
        this.apiPrefix = apiPrefix;
    }

    public Mono<ServerResponse> getCommentsByPostSlug(ServerRequest request) {
        String slug = request.pathVariable("slug");
        return ServerResponse.ok().body(commentService.getCommentsByPostSlug(slug), Comment.class);
    }

    public Mono<ServerResponse> streamComments(ServerRequest request) {
        String slug = request.pathVariable("slug");
        System.out.println("[SSE] New connection for comments stream: " + slug);

        Flux<ServerSentEvent<Comment>> sseFlux = commentService.getCommentStream(slug)
                .doOnNext(comment -> System.out.println("[SSE] Emitting comment-added event for: " + comment.getId()))
                .map(comment -> ServerSentEvent.<Comment>builder()
                        .data(comment)
                        .event("comment-added")
                        .build());

        // Add heartbeat every 15 seconds to keep connection alive
        Flux<ServerSentEvent<Comment>> heartbeat = Flux.interval(Duration.ofSeconds(15))
                .doOnNext(i -> System.out.println("[SSE] Sending heartbeat #" + i + " for slug: " + slug))
                .map(i -> ServerSentEvent.<Comment>builder()
                        .event("keep-alive")
                        .build());

        Flux<ServerSentEvent<Comment>> mergedFlux = Flux.merge(sseFlux, heartbeat);

        return ServerResponse.ok()
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .body(mergedFlux, ServerSentEvent.class);
    }

    public Mono<ServerResponse> addComment(ServerRequest request) {
        String slug = request.pathVariable("slug");
        return request.bodyToMono(Comment.class)
                .flatMap(commentValidationService::validateForCreate)
                .flatMap(comment -> commentService.addComment(slug, comment))
                .flatMap(comment -> ServerResponse.created(request.uriBuilder().path("/{id}").build(comment.getId()))
                        .bodyValue(comment))
                .onErrorResume(InvalidCommentException.class, e -> ServerResponse.badRequest().bodyValue(new ErrorResponse(e.getMessage())));
    }

    public Mono<ServerResponse> addReply(ServerRequest request) {
        Long parentId = Long.valueOf(request.pathVariable("id"));
        return request.bodyToMono(Comment.class)
                .flatMap(commentValidationService::validateForCreate)
                .flatMap(comment -> commentService.addReply(parentId, comment))
                .flatMap(comment -> ServerResponse.created(URI.create(apiPrefix + "/comments/" + comment.getId()))
                        .bodyValue(comment))
                .switchIfEmpty(ServerResponse.notFound().build())
                .onErrorResume(InvalidCommentException.class, e -> ServerResponse.badRequest().bodyValue(new ErrorResponse(e.getMessage())));
    }

    public Mono<ServerResponse> updateComment(ServerRequest request) {
        Long id = Long.valueOf(request.pathVariable("id"));
        return request.bodyToMono(Comment.class)
                .flatMap(commentValidationService::validateForUpdate)
                .flatMap(comment -> commentService.updateComment(id, comment))
                .flatMap(comment -> ServerResponse.ok().bodyValue(comment))
                .switchIfEmpty(ServerResponse.notFound().build())
                .onErrorResume(InvalidCommentException.class, e -> ServerResponse.badRequest().bodyValue(new ErrorResponse(e.getMessage())));
    }

    public Mono<ServerResponse> deleteComment(ServerRequest request) {
        Long id = Long.valueOf(request.pathVariable("id"));
        return commentService.deleteComment(id)
                .then(ServerResponse.noContent().build());
    }

    public Mono<ServerResponse> streamPosts(ServerRequest serverRequest) {
        Flux<ServerSentEvent<Post>> sseFlux = blogService.getPostStream()
                .map(post -> ServerSentEvent.<Post>builder()
                        .data(post)
                        .event("post-added")
                        .build());
        
        // Add heartbeat every 15 seconds
        Flux<ServerSentEvent<Post>> heartbeat = Flux.interval(Duration.ofSeconds(15))
                .map(i -> ServerSentEvent.<Post>builder()
                        .event("keep-alive")
                        .data(null)
                        .build());
        
        Flux<ServerSentEvent<Post>> mergedFlux = Flux.merge(sseFlux, heartbeat);
        
        return ServerResponse.ok()
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .body(mergedFlux, ServerSentEvent.class);
    }
}
