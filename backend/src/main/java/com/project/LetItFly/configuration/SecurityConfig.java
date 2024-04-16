package com.project.LetItFly.configuration;

import java.util.Arrays;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebMvc
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private static final Long MAX_AGE = 3600L;
        private static final int CORS_FILTER_ORDER = -102;

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http.authorizeHttpRequests(configurer -> configurer
                                .requestMatchers("/login").permitAll()
                                .requestMatchers("/logout-active").permitAll()
                                .requestMatchers("/registration/*").permitAll()
                                .requestMatchers("/api/check/*").permitAll()
                                .anyRequest().authenticated())
                                // .anyRequest().permitAll())
                                .sessionManagement((sessionManagement) -> sessionManagement
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .logout(logout -> logout.permitAll());

                http.httpBasic(Customizer.withDefaults());
                http.csrf((csrf) -> csrf.disable());
                return http.build();
        }

        public void configure(final WebSecurity web) {
                web.ignoring().requestMatchers(HttpMethod.OPTIONS);
        }

        @Bean
        public FilterRegistrationBean corsFilter() {
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowCredentials(true);
                config.addAllowedOriginPattern("*"); // allow all origins (must enhance security from security group on
                                                     // Cloud setting)
                config.setAllowedHeaders(Arrays.asList(
                                HttpHeaders.AUTHORIZATION,
                                HttpHeaders.CONTENT_TYPE,
                                HttpHeaders.ACCEPT));
                config.setAllowedMethods(Arrays.asList(
                                HttpMethod.OPTIONS.name(), // for preflight request from frontend
                                HttpMethod.GET.name(),
                                HttpMethod.POST.name(),
                                HttpMethod.PUT.name(),
                                HttpMethod.DELETE.name()));
                config.setMaxAge(MAX_AGE);
                source.registerCorsConfiguration("/**", config);
                FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));

                // should be set order to -100 because we need to CorsFilter before
                // SpringSecurityFilter
                bean.setOrder(CORS_FILTER_ORDER);
                return bean;
        }
}
