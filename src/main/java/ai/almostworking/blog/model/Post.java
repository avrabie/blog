package ai.almostworking.blog.model;
    
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;
import java.util.List;


@Data
@Table("post")
public class Post {
    @Id
    private Long id;
    private String slug;
    private String title;
    private String subtitle;
    private String content;
    private String author;
    private List<String> tags;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
