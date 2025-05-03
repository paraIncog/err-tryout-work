package ee.selge.err_tryout_back.DTO;

import ee.selge.err_tryout_back.model.ContentItem;
import lombok.Data;

@Data
public class ContentResponseWrapper {
    private String apiVersion;
    private ContentData data;

    @Data
    public static class ContentData {
        private ContentItem mainContent;
    }
}
