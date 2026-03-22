package ai.almostworking.blog.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.time.Duration;

@Service
public class CalculationService {

    private final Sinks.Many<Double> averageSink = Sinks.many().multicast().onBackpressureBuffer();
    private final Duration sampleDuration;

    public CalculationService() {
        this(Duration.ofSeconds(5));
    }

    public CalculationService(Duration sampleDuration) {
        this.sampleDuration = sampleDuration;
    }

    record AverageAcc(long sum, long count) {
        double getAverage() {
            return count == 0 ? 0.0 : sum / (double) count;
        }
    }

    @PostConstruct
    public void init() {
        // A "massive" Flux emitting random integers every 10ms (100 per second)
        Flux<Integer> massiveFlux = Flux.interval(Duration.ofMillis(10))
                .map(i -> (int) (Math.random() * 100))
                .take(1_0_000)
                ;

        massiveFlux.scan(new AverageAcc(0, 0), (acc, val) ->
                        new AverageAcc(acc.sum() + val, acc.count() + 1))
                .sample(sampleDuration) // Use the configured duration
                .map(AverageAcc::getAverage)
                .subscribe(averageSink::tryEmitNext);
    }

    public Flux<Double> getAverageStream() {
        return averageSink.asFlux();
    }
}
