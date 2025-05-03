package ee.selge.err_tryout_back.service;

import ee.selge.err_tryout_back.DTO.ContentResponseWrapper;
import ee.selge.err_tryout_back.model.ContentItem;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class ContentService {
    private final RestTemplate restTemplate = new RestTemplate();

    public List<ContentItem> fetchContentRange(int from, int to) {
        List<ContentItem> contentList = new ArrayList<>();
        for (int i = from; i <= to; i++) {
            try {
                String url = "https://services.err.ee/api/v2/radioAppContent/getContentPageData?contentId=" + i;
                ResponseEntity<ContentResponseWrapper> response = restTemplate.getForEntity(url, ContentResponseWrapper.class);
                ContentItem content = response.getBody().getData().getMainContent();
                if (content != null) {
                    contentList.add(content);
                }
            } catch (Exception ignored) {}
        }
        return contentList;
    }
}
