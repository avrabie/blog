package ai.almostworking.blog.route;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Configuration
public class GreetingsConfigRoute {

    @Value("${blog.api.prefix:/api/blog}")
    private String apiPrefix;

    @Bean
    public RouterFunction<ServerResponse>  routerFunctions() {
        return RouterFunctions.route()
                .path(apiPrefix, builder -> builder
                        .GET("/greetings", request -> greetingsHandler())
                )
                .build();
    }

    private static @NonNull Mono<ServerResponse> greetingsHandler() {
        return ServerResponse.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .bodyValue("Hello, World!");
    }
}
