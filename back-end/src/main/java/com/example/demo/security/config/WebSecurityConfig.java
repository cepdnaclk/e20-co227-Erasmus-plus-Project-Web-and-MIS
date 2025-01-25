package com.example.demo.security.config;

import com.example.demo.appuser.AppUserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.springframework.security.config.Customizer.withDefaults;

/**
 * Configuration class for Spring Security settings.
 */
@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig implements WebMvcConfigurer {

//    private final AppUserService appUserService;
//    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    /**
     * Configures security filter chain for HTTP requests.
     *
     * @param http HttpSecurity object to configure security settings.
     * @return SecurityFilterChain configured for the application.
     * @throws Exception If configuration fails.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authz -> authz

                                .requestMatchers("/api/v*/registration/**", "/api/v1/news/**", "/api/v1/gallery/**", "/api/v*/files/**","/api/v*/myFiles/**",
                                        "/api/v*/registration/login/**", "/api/v*/oauth2/**","/api/v1/tasks/**", "/api/v1/users/**", "/api/v*/deliverable/**", "/api/v*/workplan/**", "/api/project/**", "/api/v1/events/**", "/api/v1/notifications/**")

                                .permitAll()
                                .anyRequest().authenticated()
                        // .anyRequest().permitAll()
                )
//                .formLogin(withDefaults());
                .oauth2Login(oauth2 -> oauth2.defaultSuccessUrl("https://icpc.pdn.ac.lk", true));
        return http.build();
    }

    /**
     * Provides authentication manager bean.
     *
     * @param authenticationConfiguration AuthenticationConfiguration instance.
     * @return AuthenticationManager bean.
     * @throws Exception If authentication manager retrieval fails.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


    /**
     * Provides DaoAuthenticationProvider bean configured with password encoder and
     * user details service.
     *
     * @return DaoAuthenticationProvider bean instance.
     */
//    @Bean
//    public DaoAuthenticationProvider daoAuthenticationProvider() {
//        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        provider.setPasswordEncoder(bCryptPasswordEncoder);
//        provider.setUserDetailsService(appUserService);
//        return provider;
//    }

    /**
     * Provides CorsFilter bean to allow CORS requests from specified origins.
     *
     * @return CorsFilter bean instance.
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("https://icpc.pdn.ac.lk");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(source);
    }
}
