package com.ldg.gerenfenxiang.config;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//指明当前类是一个配置类，替代配置文件
@Configuration
public class MyAppConfig {
    private final static Logger log = LoggerFactory.getLogger(MyAppConfig.class);

    /**
     * 设置主页
     */
    @Bean
    public WebMvcConfigurer webMvcConfigurerAdapter() {
        return new WebMvcConfigurer() {
            @Override
            public void addViewControllers(ViewControllerRegistry registry) {
                registry.addViewController("/").setViewName("index");
            }
        };

    }

}
