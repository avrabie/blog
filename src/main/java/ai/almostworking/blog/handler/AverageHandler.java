package ai.almostworking.blog.handler;

import ai.almostworking.blog.service.CalculationService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class AverageHandler {

    private final CalculationService calculationService;

    public AverageHandler(CalculationService calculationService) {
        this.calculationService = calculationService;
    }

    public Mono<ServerResponse> getAverage(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .body(calculationService.getAverageStream(), Double.class);
    }
}
