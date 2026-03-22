package ai.almostworking.blog.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.net.InetSocketAddress;
import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

//Disabling for the moment
//@Component
//@Order(1)
@Slf4j
public class RequestLoggingFilter implements WebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        String requestId = UUID.randomUUID().toString();
        Instant startTime = Instant.now();

        response.getHeaders().add("X-Request-ID", requestId);

        Map<String, Object> requestLog = buildRequestLog(requestId, startTime, request);
        log.info("{}", requestLog);

        return chain.filter(exchange)
            .then(Mono.fromRunnable(() -> {
                Instant endTime = Instant.now();
                long durationMs = Duration.between(startTime, endTime).toMillis();

                Map<String, Object> responseLog = new LinkedHashMap<>();
                responseLog.put("requestId", requestId);
                responseLog.put("timestamp", endTime.toString());
                responseLog.put("status", response.getStatusCode() != null
                    ? response.getStatusCode().value()
                    : null);
                responseLog.put("durationMs", durationMs);

                log.info("{}", responseLog);
            }));
    }

    private Map<String, Object> buildRequestLog(String requestId, Instant timestamp, ServerHttpRequest request) {
        Map<String, Object> logEntry = new LinkedHashMap<>();
        logEntry.put("requestId", requestId);
        logEntry.put("timestamp", timestamp.toString());
        logEntry.put("method", request.getMethod().name());
        logEntry.put("path", request.getPath().value());
        logEntry.put("queryParams", request.getQueryParams().isEmpty() ? null : request.getQueryParams().toSingleValueMap());
        logEntry.put("remoteAddress", getRemoteAddress(request));
        logEntry.put("headers", collectHeaders(request));
        return logEntry;
    }

    private String getRemoteAddress(ServerHttpRequest request) {
        String forwardedFor = request.getHeaders().getFirst("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isEmpty()) {
            return forwardedFor.split(",")[0].trim();
        }

        InetSocketAddress remoteAddress = request.getRemoteAddress();
        if (remoteAddress != null && remoteAddress.getAddress() != null) {
            return remoteAddress.getAddress().getHostAddress();
        }

        return null;
    }

    private Map<String, String> collectHeaders(ServerHttpRequest request) {
        Map<String, String> headers = new LinkedHashMap<>();
        request.getHeaders().forEach((key, values) -> {
            headers.put(key, values.isEmpty() ? null : String.join(", ", values));
        });
        return headers;
    }
}
