package ai.almostworking.blog.route;

import ai.almostworking.blog.handler.CommentHandler;
import ai.almostworking.blog.handler.PostHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class BlogRoutes {

    @Value("${blog.api.prefix:/api/blog}")
    private String apiPrefix;

    //api/blog
    @Bean
    public RouterFunction<ServerResponse> routes(PostHandler postHandler, CommentHandler commentHandler) {
        return RouterFunctions.route()
                .path(apiPrefix, builder -> builder
                        .GET("/posts/{slug}/comments", commentHandler::getCommentsByPostSlug)
                        .POST("/posts/{slug}/comments", commentHandler::addComment)
                        .POST("/comments/{id}/replies", commentHandler::addReply)
                        .PUT("/posts/{slug}/comments/{id}", commentHandler::updateComment)
                        .DELETE("/posts/{slug}/comments/{id}", commentHandler::deleteComment)
                        .GET("/posts", postHandler::getAllPosts)
                        .POST("/posts", postHandler::createPost)
                        .GET("/posts/{slug}", postHandler::getPostBySlug)
                        .PUT("/posts/{slug}", postHandler::updatePost)
                        .DELETE("/posts/{slug}", postHandler::deletePost)
                        .DELETE("/posts/id/{id}", postHandler::deletePostById)
                        .DELETE("/posts", postHandler::deleteAllPosts) // I know!
                )
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> sseRoutes(CommentHandler commentHandler) {
        return RouterFunctions.route()
                .path(apiPrefix, builder -> builder
                        .GET("/sse/posts/{slug}/comments/stream", commentHandler::streamComments)
                        .GET("/sse/posts/stream", commentHandler::streamPosts)
                )
                .build();
    }
}
