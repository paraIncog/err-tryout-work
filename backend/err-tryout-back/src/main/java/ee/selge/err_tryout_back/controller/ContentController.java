package ee.selge.err_tryout_back.controller;

import ee.selge.err_tryout_back.model.ContentItem;
import ee.selge.err_tryout_back.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "*")
public class ContentController {
    @Autowired
    private ContentService contentService;

    @GetMapping("/range")
    public List<ContentItem> getContentRange(
            @RequestParam(defaultValue = "10") int from,
            @RequestParam(defaultValue = "30") int to) {
        return contentService.fetchContentRange(from, to);
    }
}
