package ai.almostworking.blog.route;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Configuration
public class GreetingsConfigRoute {

    @Bean
    public RouterFunction<ServerResponse>  routerFunctions() {
        return RouterFunctions.route()
                .GET("/greetings", request -> greetingsHandler())
                .build();
    }

    private static @NonNull Mono<ServerResponse> greetingsHandler() {
        return ServerResponse.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .bodyValue("Hello, World!");
    }
}
