package ai.almostworking.blog.model;
    
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;
    
    
@Data
@Table("post")
public class Post {
    @Id
    private Long id;
    private String slug;
    private String title;
    private String content;
    private String author;
    private LocalDateTime startDate;
    private LocalDateTime updatedAt;
}
