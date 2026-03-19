package ai.almostworking.blog.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Table("chat")
public class Chat {
    @Id
    private Long id;
    private String author;
    private String content;
    @CreatedDate
    private LocalDateTime createdAt;
}
