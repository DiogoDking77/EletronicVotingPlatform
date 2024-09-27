package com.atlanse.services

import com.atlanse.domains.ThemeEntity
import com.atlanse.repositories.ThemeRepository
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Slf4j
@Singleton
class ThemeService {
    @Inject
    ThemeRepository themeRepository

    // Create ThemeEntity
    ThemeEntity create(String themeName) {
        ThemeEntity theme = new ThemeEntity(theme: themeName)
        return themeRepository.save(theme)
    }

    // Retrieves a single `ThemeEntity` by its ID.
    ThemeEntity findById(UUID id) {
        return themeRepository.findById(id).orElse(null)
    }

    //Retrieves a page of `ThemeEntity` instances.
    Page<ThemeEntity> findAll(Pageable pageable) {
        return themeRepository.findAll(pageable)
    }

     // Updates an existing `ThemeEntity` with the provided theme name.
    ThemeEntity update(UUID id, String themeName) {
        ThemeEntity theme = themeRepository.findById(id).orElse(null)
        if (theme) {
            theme.theme = themeName
            return themeRepository.update(theme)
        }
        return null
    }

    // Deletes a `ThemeEntity` by its ID.
    void delete(UUID id) {
        themeRepository.deleteById(id)
    }

    List<ThemeEntity> getThemesordered(){
        return themeRepository.getThemesordered()
    }
}



