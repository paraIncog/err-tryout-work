package ee.selge.err_tryout_back.model;

import lombok.Data;

import java.util.List;

@Data
public class ContentItem {
    private int id;
    private String heading;
    private String lead;
    private List<Photo> photos;
    private List<Media> medias;
    private List<ContentItem> clips;

    @Data
    public static class Photo {
        private String photoUrlOriginal;
    }

    @Data
    public static class Media {
        private String podcastUrl;
        private String file;
        private int duration;
    }
}
