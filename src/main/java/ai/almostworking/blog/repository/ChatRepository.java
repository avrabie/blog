package ai.almostworking.blog.repository;


import ai.almostworking.blog.model.Chat;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;

public interface ChatRepository extends R2dbcRepository<Chat, Long> {
    Flux<Chat> findTop10ByOrderByCreatedAtDesc();
}
