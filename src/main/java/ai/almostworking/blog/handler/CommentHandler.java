package ai.almostworking.blog.handler;

import ai.almostworking.blog.exception.InvalidCommentException;
import ai.almostworking.blog.model.Comment;
import ai.almostworking.blog.model.ErrorResponse;
import ai.almostworking.blog.model.Post;
import ai.almostworking.blog.service.BlogService;
import ai.almostworking.blog.service.CommentService;
import ai.almostworking.blog.service.CommentValidationService;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;

@Service
public class CommentHandler {

    private final CommentService commentService;
    private final CommentValidationService commentValidationService;
    private final BlogService blogService;

    public CommentHandler(CommentService commentService, CommentValidationService commentValidationService, BlogService blogService) {
        this.commentService = commentService;
        this.commentValidationService = commentValidationService;
        this.blogService = blogService;
    }

    public Mono<ServerResponse> getCommentsByPostSlug(ServerRequest request) {
        String slug = request.pathVariable("slug");
        return ServerResponse.ok().body(commentService.getCommentsByPostSlug(slug), Comment.class);
    }

    public Mono<ServerResponse> streamComments(ServerRequest request) {
        String slug = request.pathVariable("slug");
        Flux<ServerSentEvent<Comment>> sseFlux = commentService.getCommentStream(slug)
                .map(comment -> ServerSentEvent.<Comment>builder()
                        .data(comment)
                        .event("comment-added")
                        .build());
        return ServerResponse.ok()
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .body(sseFlux, ServerSentEvent.class);
    }

    public Mono<ServerResponse> addComment(ServerRequest request) {
        String slug = request.pathVariable("slug");
        return request.bodyToMono(Comment.class)
                .flatMap(commentValidationService::validateForCreate)
                .flatMap(comment -> commentService.addComment(slug, comment))
                .flatMap(comment -> ServerResponse.created(URI.create("/posts/" + slug + "/comments/" + comment.getId()))
                        .bodyValue(comment))
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
        return ServerResponse.ok()
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .body(sseFlux, ServerSentEvent.class);
    }
}
