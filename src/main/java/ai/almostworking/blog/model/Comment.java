package ai.almostworking.blog.model;
    
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;
    
@Data
@Table("comment")
public class Comment {
    @Id
    private Long id;
    private Long postId;
    private Long parentId;
    private String author;
    private String content;
    private LocalDateTime createdAt;
}
