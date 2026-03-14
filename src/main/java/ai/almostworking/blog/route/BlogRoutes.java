package ai.almostworking.blog.route;

import ai.almostworking.blog.handler.PostHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class BlogRoutes {

    @Bean
    public RouterFunction<ServerResponse> routes(PostHandler postHandler) {
        return RouterFunctions.route()
                .GET("/posts", postHandler::getAllPosts)
                .POST("/posts", postHandler::createPost)
                .GET("/posts/{slug}", postHandler::getPostBySlug)
                .PUT("/posts/{slug}", postHandler::updatePost)
                .DELETE("/posts/{slug}", postHandler::deletePost)
                .build();
    }
}
