package ai.almostworking.blog.service;

import org.junit.jupiter.api.Test;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class CalculationServiceTest {

    @Test
    void testAverageStream() {
        CalculationService service = new CalculationService();
        service.init();
        
        Flux<Double> averageStream = service.getAverageStream();
        assertNotNull(averageStream);
        
        // Since it emits every 5 seconds, we should wait long enough or use VirtualTime
        // But for simplicity, we'll just check if it emits at least one value in 6 seconds
        StepVerifier.withVirtualTime(() -> service.getAverageStream())
                .expectSubscription()
                .thenAwait(Duration.ofSeconds(11)) // Wait for 2 intervals
                .expectNextCount(2)
                .thenCancel()
                .verify();
    }
}
