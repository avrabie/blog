package ai.almostworking.blog.service;

import org.springframework.stereotype.Service;
import java.text.Normalizer;
import java.util.regex.Pattern;

@Service
public class SlugService {

    private static final Pattern NONLATIN = Pattern.compile("[^a-z0-9-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
    private static final Pattern MULTIDASH = Pattern.compile("-+");

    public String makeSlug(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }

        String normalized = Normalizer.normalize(input.trim(), Normalizer.Form.NFD);
        String nowhitespace = WHITESPACE.matcher(normalized).replaceAll("-");
        String slug = NONLATIN.matcher(nowhitespace.toLowerCase()).replaceAll("");
        slug = MULTIDASH.matcher(slug).replaceAll("-");

        return slug.replaceAll("^-|-$", "");
    }
}
