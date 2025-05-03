package ee.selge.err_tryout_back.model;

import lombok.Data;

import java.util.List;

@Data
public class ContentItem {
    private int id;
    private String heading;
    private String lead;
    private List<Photo> photos;

    @Data
    public static class Photo {
        private String photoUrlOriginal;
    }
}