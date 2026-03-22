package ai.almostworking.blog.route;

import ai.almostworking.blog.handler.AverageHandler;
import ai.almostworking.blog.service.CalculationService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.test.StepVerifier;

import java.time.Duration;

class AverageRouteTest {

    @Test
    void testGetAverage() {
        // Use a short sample duration for tests
        CalculationService calculationService = new CalculationService(Duration.ofMillis(100));
        calculationService.init();
        AverageHandler averageHandler = new AverageHandler(calculationService);
        BlogRoutes blogRoutes = new BlogRoutes();
        RouterFunction<ServerResponse> route = blogRoutes.averageRoute(averageHandler);

        WebTestClient.bindToRouterFunction(route)
                .build()
                .get().uri("/api/getAverage")
                .accept(MediaType.TEXT_EVENT_STREAM)
                .exchange()
                .expectStatus().isOk()
                .returnResult(Double.class)
                .getResponseBody()
                .as(StepVerifier::create)
                .expectNextCount(1)
                .thenCancel()
                .verify(Duration.ofSeconds(5)); // Timeout for test
    }
}
