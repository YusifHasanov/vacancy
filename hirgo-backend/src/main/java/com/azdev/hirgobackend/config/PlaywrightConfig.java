package com.azdev.hirgobackend.config; // veya uygun bir paket

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Playwright;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PlaywrightConfig {

    private Playwright playwright;
    private Browser browser;

    @PostConstruct
    void launchBrowser() {
        // Uygulama başlarken Playwright'i ve tarayıcıyı başlat
        this.playwright = Playwright.create();
        this.browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                .setHeadless(true)
                .setArgs(java.util.Arrays.asList("--no-sandbox", "--disable-setuid-sandbox")));
    }

    @PreDestroy
    void closeBrowser() {
        // Uygulama kapanırken kaynakları serbest bırak
        if (browser != null) {
            browser.close();
        }
        if (playwright != null) {
            playwright.close();
        }
    }

    @Bean
    public Browser browser() {
        // Başlatılmış tarayıcı örneğini diğer bean'lerin kullanabilmesi için sağla
        return this.browser;
    }
}